import { PDFMetadata, Question, SavedQuiz } from '../types/quiz';

export const DEMO_PDF_METADATA: PDFMetadata = {
  fileName: 'Cell_Biology_and_Genetics_Handbook.pdf',
  fileSize: 2450000,
  pageCount: 18,
  title: 'Fundamentals of Cell Biology and Molecular Genetics',
  summary:
    'A comprehensive educational handbook covering cellular architecture, organelle functions, membrane transport mechanisms, DNA replication, transcription, and Mendelian inheritance patterns.',
  keyTopics: [
    'Cellular Organelles and Mitochondria',
    'Cell Membrane Structure and Fluid Mosaic Model',
    'Passive and Active Transport Mechanisms',
    'DNA Structure and Replication Enzymes',
    'Transcription, Translation and Protein Synthesis',
    'Mendelian Genetics and Punnett Squares',
  ],
  detectedChapters: [
    {
      id: 'chap-1',
      title: 'Chapter 1: The Eukaryotic Cell Architecture',
      description: 'Nucleus, ribosomes, endoplasmic reticulum, Golgi apparatus, and lysosomes.',
      pageRange: 'Pages 1-5',
    },
    {
      id: 'chap-2',
      title: 'Chapter 2: Membrane Dynamics & Transport',
      description: 'Phospholipid bilayer, osmolarity, facilitated diffusion, and ATP-driven pumps.',
      pageRange: 'Pages 6-10',
    },
    {
      id: 'chap-3',
      title: 'Chapter 3: Molecular Genetics & Central Dogma',
      description: 'Double helix geometry, DNA polymerase, RNA polymerase, codons, and ribosomes.',
      pageRange: 'Pages 11-15',
    },
    {
      id: 'chap-4',
      title: 'Chapter 4: Mendelian Principles of Inheritance',
      description: 'Monohybrid crosses, law of segregation, independent assortment, and alleles.',
      pageRange: 'Pages 16-18',
    },
  ],
  wordCount: 7850,
  isScannedOrLowText: false,
  extractedText: `
=== Page 1: Chapter 1 - The Eukaryotic Cell Architecture ===
Eukaryotic cells are defined by the presence of a membrane-bound nucleus and specialized sub-cellular compartments called organelles. The nucleus houses the organism's genetic material in the form of linear chromatin, protected by a double-membrane nuclear envelope punctuated by nuclear pores that regulate macromolecular traffic.
Inside the nucleus lies the nucleolus, a dense region responsible for the biogenesis of ribosomal RNA (rRNA) and the assembly of ribosomal subunits.

=== Page 2: Organelle Compartments ===
Mitochondria are often termed the powerhouses of the cell. They possess a unique double membrane: an outer membrane permeable to small ions and an extensively folded inner membrane forming cristae. The electron transport chain and ATP synthase complex reside along these cristae, generating cellular adenosine triphosphate (ATP) via oxidative phosphorylation. Uniquely, mitochondria contain their own circular DNA (mtDNA) and 70S ribosomes, supporting the endosymbiotic theory.

=== Page 3: Protein Sorting and Synthesis ===
The endoplasmic reticulum (ER) forms an interconnected network of flattened sacs (cisternae). The Rough ER is studded with ribosomes and specializes in the synthesis and folding of transmembrane, lysosomal, and secretory proteins. In contrast, the Smooth ER lacks ribosomes and performs lipid synthesis, steroid hormone production, carbohydrate metabolism, and calcium ion storage, particularly in muscle sarcoplasmic reticulum.
Proteins synthesized in the rough ER bud off in COPII-coated transport vesicles and migrate to the cis-face of the Golgi apparatus. The Golgi apparatus modifies proteins through glycosylation, phosphorylation, and sulfation before sorting them at the trans-Golgi network for delivery to lysosomes, the plasma membrane, or secretory granules.

=== Page 4: Cellular Recycling and Peroxisomes ===
Lysosomes are spherical acidic organelles containing roughly 50 diverse acid hydrolases (optimal pH ~4.5 - 5.0). The internal acidic pH is maintained by an active vacuolar H+-ATPase pump embedded in the lysosomal membrane. Lysosomes degrade macromolecules via endocytosis, phagocytosis, and autophagy.
Peroxisomes contain catalase and oxidases; they break down very long-chain fatty acids (VLCFAs) via beta-oxidation, producing hydrogen peroxide (H2O2) as an intermediate byproduct, which catalase rapidly converts into water and oxygen.

=== Page 6: Chapter 2 - Membrane Dynamics & Transport ===
The plasma membrane is described by Singer and Nicolson's Fluid Mosaic Model. It is primarily composed of an amphipathic phospholipid bilayer with hydrophobic hydrocarbon tails facing inward and hydrophilic phosphate heads oriented toward aqueous intracellular and extracellular environments. Cholesterol molecules intercalate among the phospholipids, acting as a bidirectional fluidity buffer: preventing excessive fluidity at elevated temperatures and preventing crystallization/freezing at low temperatures.

=== Page 7: Membrane Transport Pathways ===
Passive transport operates down an electrochemical gradient without the consumption of cellular metabolic energy (ATP). Simple diffusion allows nonpolar, hydrophobic molecules (e.g., O2, CO2, steroid hormones) to traverse the lipid bilayer unimpeded. Facilitated diffusion requires transmembrane proteins such as ion channels or carrier proteins (e.g., GLUT1 glucose uniporter).
Active transport requires energy expenditure to move solutes against their electrochemical gradient. Primary active transport directly hydrolyzes ATP. The canonical example is the Na+/K+-ATPase pump, which hydrolyzes 1 ATP molecule to export 3 Na+ ions out of the cell while importing 2 K+ ions into the cytoplasm, thereby establishing an electrogenic resting membrane potential.

=== Page 11: Chapter 3 - Molecular Genetics & Central Dogma ===
DNA is an antiparallel double-stranded helix structured by Watson-Crick base pairing: Adenine pairs with Thymine via two hydrogen bonds (A=T), while Guanine pairs with Cytosine via three hydrogen bonds (G≡C).
Replication is semi-conservative (demonstrated by Meselson and Stahl). DNA helicase unwinds the parental duplex at the replication fork. DNA topoisomerase (gyrase) relieves torsional strain ahead of the fork. Primase synthesizes a short RNA primer, after which DNA Polymerase III elongates the nascent strand in the 5' to 3' direction. The leading strand is synthesized continuously, while the lagging strand is synthesized discontinuously as Okazaki fragments, later joined by DNA ligase.

=== Page 13: Transcription and Translation ===
Transcription is catalyzed by RNA Polymerase II in eukaryotes. It binds to the promoter region (e.g., TATA box), initiates mRNA synthesis, and elongates the single-stranded pre-mRNA transcript. Post-transcriptional modifications include 5' 7-methylguanosine capping, 3' polyadenylation (poly-A tail), and intron excision via the spliceosome.
Translation occurs in the cytoplasm upon ribosomes. Transfer RNA (tRNA) molecules carry specific amino acids and recognize triplet mRNA codons via complementary anticodons. The start codon AUG encodes Methionine. Stop codons (UAA, UAG, UGA) recruit release factors, terminating polypeptide synthesis.

=== Page 16: Chapter 4 - Mendelian Principles of Inheritance ===
Gregor Mendel formulated fundamental inheritance laws using Pisum sativum. The Law of Segregation states that diploid individuals carry two alleles for each gene, which segregate during gamete formation so that each gamete carries only one allele.
The Law of Independent Assortment asserts that gene pairs on non-homologous chromosomes assort into gametes independently of one another during meiosis I. A dihybrid cross between two heterozygous parents (AaBb x AaBb) yields the classic 9:3:3:1 phenotypic ratio in the F2 generation.
`.trim(),
};

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'demo-q1',
    question: 'Which organelle is responsible for synthesizing ATP through oxidative phosphorylation along its folded cristae?',
    options: {
      A: 'Golgi apparatus',
      B: 'Mitochondria',
      C: 'Peroxisome',
      D: 'Rough Endoplasmic Reticulum',
    },
    correctAnswer: 'B',
    explanation:
      'Mitochondria contain an extensively folded inner membrane forming cristae where the electron transport chain and ATP synthase generate ATP via oxidative phosphorylation.',
    source: 'Chapter 1, Page 2',
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Cellular Organelles and Mitochondria',
  },
  {
    id: 'demo-q2',
    question: 'How does the Na+/K+-ATPase pump maintain the resting membrane potential across the plasma membrane?',
    options: {
      A: 'Imports 3 Na+ and exports 2 K+ using GTP',
      B: 'Exports 3 Na+ and imports 2 K+ by hydrolyzing 1 ATP',
      C: 'Facilitates passive diffusion of 2 Na+ and 3 K+ without energy',
      D: 'Transports equal amounts of 1 Na+ and 1 K+ down their gradients',
    },
    correctAnswer: 'B',
    explanation:
      'The primary active Na+/K+-ATPase pump hydrolyzes 1 ATP molecule to export 3 Na+ ions and import 2 K+ ions against their electrochemical gradients.',
    source: 'Chapter 2, Page 7',
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Passive and Active Transport Mechanisms',
  },
  {
    id: 'demo-q3',
    question: 'What is the role of cholesterol in the fluid mosaic model of the plasma membrane?',
    options: {
      A: 'Directly synthesizes transport proteins for ion channels',
      B: 'Acts as a bidirectional fluidity buffer across temperature variations',
      C: 'Covalently binds Okazaki fragments in the phospholipid layer',
      D: 'Pumps hydrogen ions to create an acidic boundary',
    },
    correctAnswer: 'B',
    explanation:
      'Cholesterol acts as a fluidity buffer: it prevents excessive fluidity at elevated temperatures and prevents phospholipid crystallization at low temperatures.',
    source: 'Chapter 2, Page 6',
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Cell Membrane Structure and Fluid Mosaic Model',
  },
  {
    id: 'demo-q4',
    question: 'During DNA replication, which enzyme is responsible for sealing nicks and joining Okazaki fragments on the lagging strand?',
    options: {
      A: 'DNA Helicase',
      B: 'RNA Polymerase II',
      C: 'DNA Ligase',
      D: 'Topoisomerase',
    },
    correctAnswer: 'C',
    explanation:
      'DNA ligase joins Okazaki fragments on the lagging strand by catalyzing phosphodiester bond formation between adjacent nucleotides.',
    source: 'Chapter 3, Page 11',
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'DNA Structure and Replication Enzymes',
  },
  {
    id: 'demo-q5',
    question: 'Which universal start codon initiates mRNA translation and specifies the amino acid Methionine?',
    options: {
      A: 'UAA',
      B: 'UGA',
      C: 'AUG',
      D: 'UAG',
    },
    correctAnswer: 'C',
    explanation:
      'The codon AUG serves as the start signal in translation and codes for Methionine, whereas UAA, UAG, and UGA are stop codons.',
    source: 'Chapter 3, Page 13',
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Transcription, Translation and Protein Synthesis',
  },
  {
    id: 'demo-q6',
    question: 'In a classic Mendelian dihybrid cross (AaBb x AaBb) between two heterozygous individuals, what phenotypic ratio is expected in the F2 generation?',
    options: {
      A: '3:1',
      B: '9:3:3:1',
      C: '1:2:1',
      D: '1:1:1:1',
    },
    correctAnswer: 'B',
    explanation:
      'According to the Law of Independent Assortment, a dihybrid cross of two heterozygous parents (AaBb x AaBb) yields a 9:3:3:1 phenotypic ratio.',
    source: 'Chapter 4, Page 16',
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Mendelian Genetics and Punnett Squares',
  },
  {
    id: 'demo-q7',
    question: 'Lysosomes maintain an internal acidic pH (4.5 - 5.0) optimal for acid hydrolases by employing which mechanism?',
    options: {
      A: 'Passive diffusion of OH- ions out of the lumen',
      B: 'An active vacuolar H+-ATPase pump in the lysosomal membrane',
      C: 'Direct breakdown of hydrogen peroxide by catalase',
      D: 'Binding of ribosomes directly to the outer surface',
    },
    correctAnswer: 'B',
    explanation:
      'The acidic lumen of lysosomes is maintained by a vacuolar H+-ATPase pump that actively pumps protons into the organelle against their gradient.',
    source: 'Chapter 1, Page 4',
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Cellular Recycling and Peroxisomes',
  },
  {
    id: 'demo-q8',
    question: 'Mitochondria contain their own circular DNA and 70S ribosomes, which supports which biological concept?',
    options: {
      A: 'Central Dogma of Molecular Biology',
      B: 'Endosymbiotic Theory',
      C: 'Fluid Mosaic Model',
      D: 'Mendelian Independent Assortment',
    },
    correctAnswer: 'B',
    explanation:
      'The presence of circular mtDNA, double membranes, and 70S ribosomes within mitochondria supports the endosymbiotic theory of organelle origin.',
    source: 'Chapter 1, Page 2',
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Cellular Organelles and Mitochondria',
  },
];

export const DEMO_SAVED_QUIZ: SavedQuiz = {
  id: 'demo-saved-quiz-1',
  title: 'Cell Biology & Genetics Assessment (Demo Data)',
  pdfName: 'Cell_Biology_and_Genetics_Handbook.pdf',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    numberOfQuestions: 8,
    difficulty: 'Mixed',
    questionType: 'MCQ',
    selectedTopic: 'Entire PDF',
    language: 'English',
    timerMinutes: 10,
  },
  questions: DEMO_QUESTIONS,
  summary: DEMO_PDF_METADATA.summary,
  isDemo: true,
};
