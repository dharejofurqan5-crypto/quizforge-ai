import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    time: new Date().toISOString(),
  });
});

/**
 * Analyze PDF content: Extracts title, educational summary, chapters/units, key topics
 */
app.post('/api/analyze-pdf', async (req: Request, res: Response) => {
  try {
    const { fileName, extractedText, pageCount, pdfBase64 } = req.body;

    if (!extractedText && !pdfBase64) {
      res.status(400).json({ error: 'No PDF text or document provided for analysis.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment.',
      });
      return;
    }

    // Build prompt for analysis
    const systemPrompt = `You are an expert academic curriculum analyst and educational assessment specialist.
Analyze the provided document text from an educational PDF file named "${fileName || 'document.pdf'}".
Identify:
1. An accurate detected title or subject.
2. A clear, high-level educational summary (3-5 sentences) describing the core academic content.
3. Detected chapters, units, or major thematic sections with their title, short description, and page/section range if discernible.
4. Key topics/concepts covered.
5. Estimate the question capacity (e.g. 15, 30, 50+) based on the depth and breadth of the content.

STRICT RULE: Only use facts and information present in the provided document text. Do NOT fabricate topics that do not exist in the text.`;

    const contentsPayload: any[] = [];

    if (pdfBase64 && (!extractedText || extractedText.trim().length < 300)) {
      // If client text is low, send PDF inlineData directly
      contentsPayload.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64,
        },
      });
      contentsPayload.push({
        text: `${systemPrompt}\n\nPlease analyze this document.`,
      });
    } else {
      // Send extracted text (trim if huge, but Flash handles huge context up to 1M tokens)
      const textToAnalyze = extractedText.length > 300000 ? extractedText.slice(0, 300000) : extractedText;
      contentsPayload.push({
        text: `${systemPrompt}\n\n=== DOCUMENT TEXT START ===\n${textToAnalyze}\n=== DOCUMENT TEXT END ===`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Detected title or subject of the document' },
            summary: { type: Type.STRING, description: 'Academic summary of the document' },
            detectedChapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pageRange: { type: Type.STRING },
                },
                required: ['id', 'title'],
              },
            },
            keyTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            estimatedQuestionsCapacity: { type: Type.INTEGER },
          },
          required: ['title', 'summary', 'detectedChapters', 'keyTopics'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        data = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse JSON response from analysis model.');
      }
    }

    res.json({
      title: data.title || fileName?.replace(/\.[^/.]+$/, '') || 'Educational Document',
      summary: data.summary || 'Summary unavailable.',
      detectedChapters: data.detectedChapters || [],
      keyTopics: data.keyTopics || [],
      estimatedQuestionsCapacity: data.estimatedQuestionsCapacity || 25,
      pageCount: pageCount || 1,
      wordCount: extractedText ? extractedText.trim().split(/\s+/).length : 0,
      isScannedOrLowText: Boolean(!extractedText || extractedText.trim().length < 200),
    });
  } catch (error: any) {
    console.error('Error analyzing PDF:', error);
    res.status(500).json({
      error: error?.message || 'Unable to read this PDF. Please try another PDF.',
    });
  }
});

/**
 * Generate MCQs / True-False questions strictly from the PDF content
 */
app.post('/api/generate-questions', async (req: Request, res: Response) => {
  try {
    const { extractedText, pdfBase64, settings, existingQuestions } = req.body;

    if (!extractedText && !pdfBase64) {
      res.status(400).json({ error: 'Document text or PDF buffer is required to generate questions.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in your environment.',
      });
      return;
    }

    const count = Number(settings?.numberOfQuestions) || 10;
    const difficulty = settings?.difficulty || 'Mixed';
    const questionType = settings?.questionType || 'MCQ';
    const topic = settings?.selectedTopic || 'Entire PDF';
    const language = settings?.language || 'English';

    const systemInstruction = `You are an expert educational assessment generator and senior exam paper author.
Generate accurate, pedagogically sound questions strictly from the supplied document content.

CORE ASSESSMENT PRINCIPLES:
1. Do NOT make up facts or invent details not stated in the source text.
2. Every correct answer MUST be directly supported and verifiable by the supplied document content.
3. Plausible distractors: Create distractors (incorrect options) that are plausible misconceptions or contradicted/unsupported by the source, never silly or obviously fake options.
4. Only one option must be clearly, undeniably correct.
5. Provide an educational explanation for each question explaining WHY the correct option is right with reference to the text.
6. Provide an accurate source reference (e.g. "Chapter 2, Page 14" or "Page 7: Membrane Transport" or section title). If exact page numbers are not available in the text, reference the section or topic. Do not invent false page numbers.
7. Question distribution: Generate a balanced mix of recall, concept understanding, terminology, cause/effect, and definitions.
8. Avoid ambiguous phrasing. Do not ask trivia like "What is mentioned on line 3?". Focus on educational knowledge.

SETTINGS:
- Target question count: ${count}
- Difficulty: ${difficulty}
- Question Type: ${questionType} (If MCQ: exactly 4 options A, B, C, D. If True/False: options A: "True", B: "False", C: "N/A", D: "N/A". If Mixed: provide both).
- Focus Scope: ${topic === 'Entire PDF' ? 'Cover all major chapters and sections of the document' : `Focus specifically on: ${topic}`}
- Language: Output questions, options, and explanations in ${language}. If Urdu or Sindhi, write in authentic script.

${existingQuestions && existingQuestions.length > 0 ? `Do NOT duplicate or re-ask any of these already generated questions:\n- ${existingQuestions.slice(0, 15).join('\n- ')}` : ''}

If the provided document does not contain enough information to generate ${count} high-quality questions without fabricating facts, generate as many valid questions as legitimately possible rather than inventing information.`;

    const contentsPayload: any[] = [];

    if (pdfBase64 && (!extractedText || extractedText.trim().length < 300)) {
      contentsPayload.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64,
        },
      });
      contentsPayload.push({
        text: `Generate ${count} assessment questions based strictly on the uploaded document according to the system instructions.`,
      });
    } else {
      const textChunk = extractedText.length > 400000 ? extractedText.slice(0, 400000) : extractedText;
      contentsPayload.push({
        text: `=== SOURCE EDUCATIONAL TEXT START ===\n${textChunk}\n=== SOURCE EDUCATIONAL TEXT END ===\n\nGenerate ${count} assessment questions based strictly on the source text above according to the instructions.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.OBJECT,
                    properties: {
                      A: { type: Type.STRING },
                      B: { type: Type.STRING },
                      C: { type: Type.STRING },
                      D: { type: Type.STRING },
                    },
                    required: ['A', 'B', 'C', 'D'],
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    enum: ['A', 'B', 'C', 'D'],
                  },
                  explanation: { type: Type.STRING },
                  source: { type: Type.STRING },
                  difficulty: {
                    type: Type.STRING,
                    enum: ['Easy', 'Medium', 'Hard'],
                  },
                  type: {
                    type: Type.STRING,
                    enum: ['mcq', 'true_false'],
                  },
                  topic: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswer', 'explanation', 'source', 'difficulty', 'type'],
              },
            },
            notes: { type: Type.STRING, description: 'Optional feedback or note regarding coverage' },
          },
          required: ['questions'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        data = JSON.parse(match[0]);
      } else {
        throw new Error('Unable to parse generated questions JSON.');
      }
    }

    const questions = (data.questions || []).map((q: any, idx: number) => ({
      id: `q-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      question: q.question,
      options: {
        A: q.options?.A || 'Option A',
        B: q.options?.B || 'Option B',
        C: q.options?.C || 'Option C',
        D: q.options?.D || 'Option D',
      },
      correctAnswer: (['A', 'B', 'C', 'D'].includes(q.correctAnswer) ? q.correctAnswer : 'A') as 'A' | 'B' | 'C' | 'D',
      explanation: q.explanation || 'Refer to the source text.',
      source: q.source || 'Uploaded Document',
      type: q.type || 'mcq',
      difficulty: q.difficulty || (difficulty === 'Mixed' ? ['Easy', 'Medium', 'Hard'][idx % 3] : difficulty),
      topic: q.topic || topic,
    }));

    if (questions.length === 0) {
      res.status(422).json({
        error: 'The uploaded PDF does not contain enough usable information to generate the requested questions.',
      });
      return;
    }

    res.json({
      questions,
      notes: data.notes || '',
      generatedCount: questions.length,
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: error?.message || 'Question generation failed. Please try again.',
    });
  }
});

/**
 * Regenerate a single question to replace an undesirable or redundant question
 */
app.post('/api/regenerate-single-question', async (req: Request, res: Response) => {
  try {
    const { extractedText, pdfBase64, settings, avoidQuestion, allCurrentQuestions } = req.body;

    if (!extractedText && !pdfBase64) {
      res.status(400).json({ error: 'Document text is required.' });
      return;
    }

    if (!apiKey) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const difficulty = settings?.difficulty || 'Medium';
    const questionType = settings?.questionType || 'MCQ';
    const topic = settings?.selectedTopic || 'Entire PDF';
    const language = settings?.language || 'English';

    const systemInstruction = `You are an expert assessment author.
Generate exactly ONE new, distinct, high-quality question strictly from the supplied document.

CRITICAL REQUIREMENTS:
1. Do NOT repeat or rephrase the question being replaced: "${avoidQuestion || ''}"
2. Do NOT duplicate any of the other current questions:
${(allCurrentQuestions || []).slice(0, 15).map((q: string) => `- ${q}`).join('\n')}
3. Answer and distractors must be strictly based on the text.
4. Provide options A, B, C, D, with correctAnswer, explanation, and source reference.
5. Language: ${language}. Difficulty: ${difficulty}. Type: ${questionType}.`;

    const contentsPayload: any[] = [];
    if (pdfBase64 && (!extractedText || extractedText.trim().length < 300)) {
      contentsPayload.push({
        inlineData: { mimeType: 'application/pdf', data: pdfBase64 },
      });
      contentsPayload.push({ text: 'Generate one fresh replacement question strictly from this PDF.' });
    } else {
      const textChunk = extractedText.length > 300000 ? extractedText.slice(0, 300000) : extractedText;
      contentsPayload.push({
        text: `=== SOURCE TEXT ===\n${textChunk}\n=== END ===\n\nGenerate 1 replacement question based strictly on this source text.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                A: { type: Type.STRING },
                B: { type: Type.STRING },
                C: { type: Type.STRING },
                D: { type: Type.STRING },
              },
              required: ['A', 'B', 'C', 'D'],
            },
            correctAnswer: {
              type: Type.STRING,
              enum: ['A', 'B', 'C', 'D'],
            },
            explanation: { type: Type.STRING },
            source: { type: Type.STRING },
            difficulty: {
              type: Type.STRING,
              enum: ['Easy', 'Medium', 'Hard'],
            },
            type: {
              type: Type.STRING,
              enum: ['mcq', 'true_false'],
            },
            topic: { type: Type.STRING },
          },
          required: ['question', 'options', 'correctAnswer', 'explanation', 'source', 'difficulty', 'type'],
        },
      },
    });

    const raw = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
      else throw new Error('Failed to parse question JSON');
    }

    const newQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      question: data.question,
      options: {
        A: data.options?.A || 'Option A',
        B: data.options?.B || 'Option B',
        C: data.options?.C || 'Option C',
        D: data.options?.D || 'Option D',
      },
      correctAnswer: (['A', 'B', 'C', 'D'].includes(data.correctAnswer) ? data.correctAnswer : 'A') as 'A' | 'B' | 'C' | 'D',
      explanation: data.explanation || 'Refer to the source text.',
      source: data.source || 'Uploaded Document',
      type: data.type || 'mcq',
      difficulty: data.difficulty || difficulty,
      topic: data.topic || topic,
    };

    res.json({ question: newQuestion });
  } catch (error: any) {
    console.error('Error regenerating question:', error);
    res.status(500).json({ error: error?.message || 'Failed to regenerate question.' });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuizForge AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
