import type { QuizStepConfig } from '../types/quiz';

// 16 steps — index 0 = step 1, index 15 = step 16
export const quizConfig: QuizStepConfig[] = [
  // Step 1: Age range
  {
    type: 'single-select-card',
    question: 'Qual é a sua faixa etária?',
    options: [
      { value: '25-34', label: '25 a 34 anos', icon: '🌱' },
      { value: '35-44', label: '35 a 44 anos', icon: '🌿' },
      { value: '45-54', label: '45 a 54 anos', icon: '🌳' },
      { value: '55+',   label: '55 anos ou mais', icon: '🌸' },
    ],
  },

  // Step 2: Blocked area
  {
    type: 'single-select-card',
    question: 'Em qual área da vida você se sente mais bloqueada?',
    subtitle: 'Escolha a área que mais te preocupa agora',
    options: [
      { value: 'financeiro',      label: 'Prosperidade Financeira', icon: '✦', description: 'Dinheiro, carreira e abundância' },
      { value: 'relacionamentos', label: 'Relacionamentos',          icon: '♥', description: 'Amor, família e conexões' },
      { value: 'saude',           label: 'Saúde e Vitalidade',       icon: '✿', description: 'Corpo, energia e bem-estar' },
      { value: 'proposito',       label: 'Propósito e Missão',       icon: '★', description: 'Sentido, impacto e realização' },
    ],
  },

  // Step 3: Transition statistic (dynamic content inside component)
  { type: 'transition-statistic' },

  // Step 4: Emotional state
  {
    type: 'single-select-emoji',
    question: 'Como você descreveria seu estado interno nos últimos meses?',
    options: [
      { value: 'travada',   label: 'Travada',   icon: '😶' },
      { value: 'frustrada', label: 'Frustrada', icon: '😔' },
      { value: 'cansada',   label: 'Esgotada',  icon: '😩' },
      { value: 'ansiosa',   label: 'Ansiosa',   icon: '😟' },
    ],
  },

  // Step 5: Tried before
  {
    type: 'single-select-text',
    question: 'Você já tentou mudar esse padrão antes e não conseguiu de forma duradoura?',
    options: [
      { value: 'sim-varias', label: 'Sim, várias vezes' },
      { value: 'sim-uma',    label: 'Sim, uma ou duas vezes' },
      { value: 'nao-tentei', label: 'Ainda não tentei, mas quero' },
    ],
  },

  // Step 6: Self-worth
  {
    type: 'single-select-text',
    question: 'No fundo, você acredita que merece uma vida mais abundante e plena?',
    options: [
      { value: 'sim-certeza', label: 'Sim, com toda certeza' },
      { value: 'sim-mas',     label: 'Acredito, mas algo sempre me impede' },
      { value: 'nao-sei',     label: 'Honestamente, não tenho certeza' },
    ],
  },

  // Step 7: Transition affirmation — reassurance (dynamic content inside component)
  { type: 'transition-affirmation' },

  // Step 8: Signs multi-select
  {
    type: 'multi-select',
    question: 'Quais desses sinais você reconhece em sua vida?',
    subtitle: 'Selecione todos que se aplicam (mínimo 2)',
    options: [
      { value: 'anxiety',            label: 'Ansiedade ou preocupação constante' },
      { value: 'procrastination',    label: 'Procrastinação em projetos importantes' },
      { value: 'self_sabotage',      label: 'Autossabotagem nos momentos cruciais' },
      { value: 'money_repulsion',    label: 'Dificuldade em manter dinheiro' },
      { value: 'fatigue',            label: 'Cansaço profundo e persistente' },
      { value: 'low_self_esteem',    label: 'Dificuldade em se sentir merecedora' },
      { value: 'relationship_issues',label: 'Padrões repetitivos em relacionamentos' },
      { value: 'insomnia',           label: 'Pensamentos acelerados à noite' },
    ],
  },

  // Step 9: Blockage level scale
  {
    type: 'emoji-scale',
    question: 'Com qual intensidade esse bloqueio afeta sua vida hoje?',
    subtitle: 'Seja honesta consigo mesma',
    min: 1,
    max: 5,
  },

  // Step 10: Pivot — the most important screen (dynamic inside component)
  { type: 'pivot' },

  // Step 11: Readiness
  {
    type: 'single-select-emoji',
    question: 'Se você soubesse exatamente quando e como agir para destravar, o que faria?',
    options: [
      { value: 'agir-agora', label: 'Agiria agora mesmo!',    icon: '🔥' },
      { value: 'agir-logo',  label: 'Agiria o quanto antes',  icon: '⚡' },
      { value: 'pensar',     label: 'Precisaria pensar mais',  icon: '💭' },
    ],
  },

  // Step 12: Loading / analysis screen
  { type: 'loading' },

  // Step 13: Email capture (gates the result)
  { type: 'email-capture' },

  // Step 14: Diagnosis result
  { type: 'result' },

  // Step 15: Micro VSL
  { type: 'micro-vsl' },

  // Step 16: Checkout
  { type: 'checkout' },
];
