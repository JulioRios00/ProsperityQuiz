import type { QuizStepConfig } from '../types/quiz';

// 16 steps — index 0 = step 1, index 15 = step 16
export const quizConfig: QuizStepConfig[] = [
  // Step 1: Money relationship
  {
    type: 'single-select-card',
    question: 'Como você descreveria sua relação com dinheiro hoje?',
    options: [
      { value: 'travada',   label: 'Travada',   description: 'Mulher frustrada olhando contas, mãos na cabeça' },
      { value: 'instavel',  label: 'Instável',  description: 'Mulher preocupada olhando celular, dúvida' },
      { value: 'limitada',  label: 'Limitada',  description: 'Mulher controlando planilha, cansada' },
      { value: 'caotica',   label: 'Caótica',   description: 'Mesa bagunçada com contas e cartões' },
    ],
  },

  // Step 2: Age range
  {
    type: 'single-select-card',
    question: 'Qual sua faixa de idade?',
    subtitle: 'Isso influencia diretamente o tipo de bloqueio predominante',
    options: [
      { value: '25-34', label: '25 a 34 anos', image: '/25-34.png' },
      { value: '35-44', label: '35 a 44 anos', image: '/35-44.png' },
      { value: '45-54', label: '45 a 54 anos', image: '/45-54.png' },
      { value: '55+',   label: '55+ anos',     image: '/55+.png'   },
    ],
  },

  // Step 3: Transition statistic (dynamic content inside component)
  { type: 'transition-statistic' },

  // Step 4: Blocked area emoji
  {
    type: 'single-select-emoji',
    question: 'Qual área da sua vida está MAIS travada hoje?',
    options: [
      { value: 'financeiro',      label: 'Dinheiro e finanças',    icon: '💰' },
      { value: 'proposito',       label: 'Carreira e propósito',   icon: '💼' },
      { value: 'relacionamentos', label: 'Relacionamentos',         icon: '❤️' },
      { value: 'saude',           label: 'Saúde e energia vital',  icon: '🧘' },
      { value: 'tudo',            label: 'Tudo parece travado',    icon: '🔒' },
    ],
  },

  // Step 5: Repeating patterns (binary)
  {
    type: 'single-select-text',
    variant: 'binary',
    question: 'Você sente que REPETE os mesmos padrões financeiros, mesmo quando muda de estratégia?',
    options: [
      { value: 'sim', label: '✅ Sim, sempre volto ao mesmo lugar' },
      { value: 'nao', label: '❌ Não, acho que é só falta de oportunidade' },
    ],
  },

  // Step 6: Money disappears (binary)
  {
    type: 'single-select-text',
    variant: 'binary',
    question: 'O dinheiro que entra na sua vida costuma SUMIR rápido, como se escorresse pelas mãos?',
    options: [
      { value: 'sim', label: '✅ Sim, é exatamente assim' },
      { value: 'nao', label: '❌ Não, consigo manter' },
    ],
  },

  // Step 7: Transition affirmation (dynamic on age from step 2)
  { type: 'transition-affirmation' },

  // Step 8: Signs multi-select
  {
    type: 'multi-select',
    question: 'Quais desses sinais você reconhece na sua vida?',
    subtitle: 'Selecione todos que se aplicam',
    minSelect: 1,
    options: [
      { value: 'money_gone',      icon: '💸', label: 'Dinheiro entra e some sem explicação' },
      { value: 'projects',        icon: '🚫', label: 'Projetos que nunca decolam de verdade' },
      { value: 'restart',         icon: '🔄', label: 'Sensação de estar sempre recomeçando do zero' },
      { value: 'self_sabotage',   icon: '🧠', label: 'Autossabotagem em momentos-chave' },
      { value: 'charge_fear',     icon: '😶', label: 'Medo de cobrar o que vale' },
      { value: 'not_for_me',      icon: '🔒', label: 'Sensação de que "não é pra mim"' },
    ],
  },

  // Step 9: Blockage level scale
  {
    type: 'emoji-scale',
    question: 'De 1 a 5, o quanto você sente que ALGO INVISÍVEL trava sua prosperidade?',
    min: 1,
    max: 5,
  },

  // Step 10: Pivot — the most important screen (dynamic inside component)
  { type: 'pivot' },

  // Step 11: Urgency / timing
  {
    type: 'single-select-emoji',
    question: 'Quando você quer começar a destravar sua prosperidade?',
    options: [
      { value: 'hoje',    label: 'Hoje mesmo',                icon: '⚡' },
      { value: 'semana',  label: 'Esta semana',               icon: '📅' },
      { value: 'mes',     label: 'Este mês',                  icon: '🗓' },
      { value: 'hora',    label: 'Quando sentir que é a hora', icon: '🕐' },
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
