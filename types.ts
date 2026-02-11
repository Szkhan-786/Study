
export enum Subject {
  HAP = 'Human Anatomy & Physiology',
  Analysis = 'Pharmaceutical Analysis',
  Pharmaceutics = 'Pharmaceutics',
  Inorganic = 'Pharmaceutical Inorganic Chemistry',
  Communication = 'Communication Skills',
  RemedialBio = 'Remedial Biology',
  RemedialMath = 'Remedial Mathematics'
}

export enum AnswerLength {
  Quick = 'Quick Revision',
  Exam = 'Exam Notes',
  Detailed = 'Detailed Explanation'
}

export interface UserPreferences {
  subject: Subject;
  topic: string;
  semester: string;
  university?: string;
  length: AnswerLength;
  includeDiagrams: boolean;
  includeMnemonics: boolean;
  includeClinicalCorrelation: boolean;
}

export interface NoteSection {
  title: string;
  content: string | string[];
}

export interface StudyNotes {
  introduction: string;
  definition?: string;
  classification?: { type: string; explanation: string }[];
  detailedExplanation: string[];
  examples: string[];
  diagramDescription?: string;
  examPoints: { point: string; mnemonic?: string }[];
  shortAnswerQuestions: string[];
  longAnswerQuestions: string[];
  pyqs: string[];
  vivaQuestions: string[];
  clinicalCorrelation?: string;
}
