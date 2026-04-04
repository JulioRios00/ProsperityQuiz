import type { QuizStepConfig } from '../types/quiz';
import { quizConfigA } from './quizConfigA';

// Variant B — overrides Steps 1 and 6; all others identical to A
export const quizConfigB: QuizStepConfig[] = [
  // Step 1 — Tela 2: Frases que Você Já Falou (reescrita B)
  {
    type: 'single-select-text',
    question: 'Qual dessas frases você já falou (ou pensou) essa semana?',
    options: [
      { value: 'nao_sei',      label: '"Não sei pra onde meu dinheiro vai"' },
      { value: 'ganho_bem',    label: '"Ganho bem, mas nunca sobra"' },
      { value: 'medo_olhar',   label: '"Tenho medo de olhar minha conta"' },
      { value: 'trabalho_dem', label: '"Trabalho demais pro que ganho"' },
    ],
  },

  // Steps 2-5 — identical to Variant A (indices 1-4)
  ...quizConfigA.slice(1, 5),

  // Step 6 — Tela 7: Padrão Financeiro (reescrita B — sem Sim/Não)
  {
    type: 'single-select-text',
    question: "Quantas vezes você já prometeu 'desse mês não passa' — e o mesmo padrão se repetiu?",
    options: [
      { value: 'perdi_contas', label: 'Perdi as contas — é sempre a mesma história' },
      { value: '3_4_vezes',    label: 'Umas 3-4 vezes, pelo menos' },
      { value: 'agora_mesmo',  label: 'Estou nesse ciclo agora mesmo' },
      { value: 'percebi',      label: 'Recentemente percebi que isso acontece' },
    ],
  },

  // Step 7 — Tela 8: O Que Acontece com o Dinheiro (reescrita B — sem Sim/Não)
  {
    type: 'single-select-text',
    question: 'O que acontece quando o dinheiro começa a entrar?',
    options: [
      { value: 'despesa_urgente', label: 'Aparece uma despesa urgente que leva tudo' },
      { value: 'gasto_sem',       label: 'Gasto sem perceber e quando vejo, acabou' },
      { value: 'ansiosa',         label: 'Fico ansiosa e gasto pra aliviar' },
      { value: 'evapora',         label: 'Guardo um pouco, mas ele evapora do mesmo jeito' },
    ],
  },

  // Step 8 — identical to Variant A (index 7: multi-select sinais)
  ...quizConfigA.slice(7, 8),

  // Step 9 — Tela 10: Bloqueio Invisível emocional (reescrita B — pressuposição)
  {
    type: 'single-select-text',
    question: 'Se existisse um bloqueio energético travando seu dinheiro SEM você saber... qual a chance de você estar carregando um agora?',
    options: [
      { value: 'certeza',   label: 'Tenho certeza absoluta que sim — sinto isso todo dia' },
      { value: 'alta',      label: 'Alta — muita coisa não faz sentido de outra forma' },
      { value: 'media',     label: 'Média — algo está errado, mas não sei explicar' },
      { value: 'nunca',     label: 'Nunca pensei nisso, mas agora faz sentido' },
    ],
  },

  // Step 10 — Tela 11: Palmistry Capture (reescrita B — headline + CTA)
  { type: 'palmistry-capture', variant: 'b' },

  // Step 11 — Tela 12: Palmistry Analysis (reescrita B — headline)
  { type: 'palmistry-analysis', variant: 'b' },

  // Steps 12-16 — identical to Variant A (indices 11-15)
  ...quizConfigA.slice(11, 16),

  // Step 17 — Tela 17: Paywall B (Calendário + 21 Rituais + App, R$9,90, timer 14:59, garantia 7 dias)
  { type: 'paywall-b' },
];
