import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  ShieldCheck,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { extractTextFromPDF, formatBytes } from '../services/pdfExtractor';
import { analyzePDFAPI } from '../services/api';
import { PDFMetadata } from '../types/quiz';
import { DEMO_PDF_METADATA } from '../data/demoData';

interface PDFUploadSectionProps {
  onAnalysisComplete: (metadata: PDFMetadata) => void;
  onLoadDemo: () => void;
}

export const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
  onAnalysisComplete,
  onLoadDemo,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisStages = [
    'Uploading PDF',
    'Reading PDF',
    'Extracting content',
    'Understanding chapters/topics',
    'Preparing question generation',
    'Ready',
  ];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);
    setWarningMessage(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds 50MB. Please choose a smaller PDF or compress it.');
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setWarningMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setWarningMessage(null);
    setCurrentStage(0);
    setProgressPercent(10);
    setStatusMessage('Uploading PDF...');

    try {
      // Stage 1: Uploading
      setCurrentStage(0);
      setProgressPercent(15);
      await new Promise((r) => setTimeout(r, 400));

      // Stage 2 & 3: Reading PDF & Extracting Content
      setCurrentStage(1);
      setProgressPercent(30);
      setStatusMessage('Reading PDF structure...');

      const extracted = await extractTextFromPDF(selectedFile, (stageText, pct) => {
        setStatusMessage(stageText);
        setProgressPercent(Math.min(70, pct));
      });

      setCurrentStage(2);
      setProgressPercent(65);
      setStatusMessage('Extracting text and page boundaries...');
      await new Promise((r) => setTimeout(r, 300));

      if (extracted.isScannedOrLowText) {
        setWarningMessage('Some PDF pages may contain scanned images. Text extraction may be limited.');
      }

      // Stage 4: Understanding chapters/topics (Call Gemini API)
      setCurrentStage(3);
      setProgressPercent(78);
      setStatusMessage('Understanding chapters and key concepts via AI...');

      const analysisResult = await analyzePDFAPI({
        fileName: extracted.fileName,
        extractedText: extracted.extractedText,
        pageCount: extracted.pageCount,
        pdfBase64: extracted.pdfBase64,
      });

      // Stage 5: Preparing Question Generation
      setCurrentStage(4);
      setProgressPercent(92);
      setStatusMessage('Preparing question generation settings...');
      await new Promise((r) => setTimeout(r, 400));

      // Stage 6: Ready
      setCurrentStage(5);
      setProgressPercent(100);
      setStatusMessage('Ready!');
      await new Promise((r) => setTimeout(r, 300));

      const finalMetadata: PDFMetadata = {
        fileName: extracted.fileName,
        fileSize: extracted.fileSize,
        pageCount: extracted.pageCount,
        extractedText: extracted.extractedText,
        pdfBase64: extracted.pdfBase64,
        title: analysisResult.title,
        summary: analysisResult.summary,
        detectedChapters: analysisResult.detectedChapters,
        keyTopics: analysisResult.keyTopics,
        wordCount: analysisResult.wordCount,
        isScannedOrLowText: analysisResult.isScannedOrLowText || extracted.isScannedOrLowText,
      };

      onAnalysisComplete(finalMetadata);
    } catch (err: any) {
      console.error('PDF Analysis failed:', err);
      setErrorMessage(
        err?.message || 'Unable to read this PDF. Please try another PDF or check your connection.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Header Info */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-semibold text-indigo-700">
          <BookOpen className="w-3.5 h-3.5" />
          Step 1: Document Ingestion
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload your PDF book or study material
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          AI will analyze the uploaded PDF and generate questions <span className="font-semibold text-indigo-600">only from the uploaded content</span>.
        </p>
      </div>

      {/* Error or Warning Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Analysis Failed</p>
            <p className="text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {warningMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Notice</p>
            <p className="text-amber-800 mt-0.5">{warningMessage}</p>
          </div>
          <button
            onClick={() => setWarningMessage(null)}
            className="text-amber-500 hover:text-amber-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Container */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-white ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
          } shadow-xs hover:shadow-md`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xs">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Drag and drop your PDF here
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            or <span className="text-indigo-600 font-semibold underline underline-offset-2">browse your computer</span> to select a file
          </p>

          <div className="inline-flex items-center gap-3 text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            <span>Supports PDF files up to 50MB</span>
            <span>•</span>
            <span>Textbooks, Notes, Research, Lecture slides</span>
          </div>

          {/* Quick Demo Option */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-slate-500">Don't have a PDF ready?</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLoadDemo();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Load Sample Educational PDF (Cell Biology & Genetics)
            </button>
          </div>
        </div>
      ) : (
        /* Selected File Card & Actions */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-base truncate max-w-sm sm:max-w-md" title={selectedFile.name}>
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-600">{formatBytes(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready for analysis
                  </span>
                </div>
              </div>
            </div>

            {!isAnalyzing && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                >
                  Upload another PDF
                </button>
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove selected PDF"
                >
                  <X className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Privacy & Academic Integrity Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-100/70 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-800">Privacy Notice:</strong> Your uploaded document is used exclusively to extract concepts and generate educational questions. Content stays in temporary session memory.
            </p>
          </div>

          {/* Analysis Progress View (Section 4) */}
          {isAnalyzing ? (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-indigo-700 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {statusMessage || 'Processing document...'}
                  </span>
                  <span className="text-slate-600">{progressPercent}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 6 Stage Steps Display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {analysisStages.map((stage, idx) => {
                  const isDone = currentStage > idx;
                  const isCurrent = currentStage === idx;
                  return (
                    <div
                      key={stage}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                          : isCurrent
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <span className="truncate">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Action Button: Analyze PDF (Rule: Do not start generating questions before user clicks!) */
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                Analyze PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
