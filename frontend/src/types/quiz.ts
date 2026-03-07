export type AgeRange = '25-34' | '35-44' | '45-54' | '55+';
export type BlockedArea = 'financeiro' | 'relacionamentos' | 'saude' | 'proposito';

export type StepType =
  | 'single-select-card'
  | 'single-select-emoji'
  | 'single-select-text'
  | 'multi-select'
  | 'emoji-scale'
  | 'transition-statistic'
  | 'transition-affirmation'
  | 'pivot'
  | 'loading'
  | 'email-capture'
  | 'result'
  | 'micro-vsl'
  | 'checkout';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  image?: string;
}

export interface QuizStepConfig {
  type: StepType;
  question?: string;
  subtitle?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  variant?: string;
  minSelect?: number;
}

export interface DiagnosisResult {
  id: string;
  diagnosis_text: string;
  favorable_days: number;
  blocked_area: BlockedArea;
  blockage_level: number;
  created_at: string;
}
