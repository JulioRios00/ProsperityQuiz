# Quiz Funnel C1 - Implementation Plan
## "Do Bloqueio ao Calendário" - Diagnostic + 3D Abundance Map

---

## EXECUTIVE SUMMARY

**Project:** Interactive quiz funnel for astrology/prosperity subscription service
**Target Audience:** Brazilian women aged 30-55 frustrated with recurring financial blocks
**Total Screens:** 17 (1 prelanding + 16 quiz steps)
**Conversion Model:** R$4.90 trial (7 days) → R$24.90/month subscription
**Authority Figure:** Mestra Renata Alves (Numerologist & Vibrational Therapist)

---

## 1. TECHNICAL ARCHITECTURE

### 1.1 Technology Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Architecture:** Single-page application (SPA)
- **Data Storage:** localStorage (user progress) + sessionStorage (temporary state)
- **Deployment:** Static hosting (Netlify/Vercel recommended)

### 1.2 Why This Stack?
- ✅ Fast load times (critical for conversion)
- ✅ No framework overhead
- ✅ Easy to maintain and modify
- ✅ Works on all devices
- ✅ Simple deployment

### 1.3 File Structure
```
quiz-funnel-c1/
│
├── index.html                  # Main HTML file (SPA)
│
├── css/
│   ├── 01-variables.css       # Design tokens (colors, spacing, fonts)
│   ├── 02-reset.css           # CSS reset
│   ├── 03-typography.css      # Font styles
│   ├── 04-base.css            # Base styles
│   ├── 05-components.css      # Reusable components
│   ├── 06-steps.css           # Step-specific styles
│   ├── 07-animations.css      # Transitions and animations
│   └── 08-responsive.css      # Media queries
│
├── js/
│   ├── config.js              # Quiz configuration & all content
│   ├── state.js               # State management
│   ├── storage.js             # localStorage handling
│   ├── navigation.js          # Step navigation logic
│   ├── components.js          # UI component builders
│   ├── dynamic-content.js     # Dynamic text replacement
│   ├── validation.js          # Form validation
│   ├── analytics.js           # Event tracking
│   └── main.js                # App initialization & orchestration
│
├── assets/
│   ├── images/
│   │   ├── authority/         # Mestra Renata photos
│   │   ├── options/           # Step option images
│   │   ├── icons/             # Emojis and icons
│   │   └── mockups/           # Product mockups
│   ├── fonts/                 # Local font files (if needed)
│   └── videos/                # VSL video
│
├── README.md                   # Setup instructions
└── DEPLOYMENT.md              # Deployment guide
```

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette
```css
/* Primary Colors */
--color-background: #FFF8F0;      /* Cream background */
--color-primary: #C8963E;         /* Gold */
--color-primary-dark: #A67B32;    /* Darker gold for hover */

/* Text Colors */
--color-text-primary: #2C2C2C;    /* Dark text */
--color-text-secondary: #666666;  /* Light text */
--color-text-tertiary: #999999;   /* Muted text */

/* Semantic Colors */
--color-success: #4CAF50;         /* Green (checkmarks) */
--color-error: #F44336;           /* Red (errors) */
--color-warning: #FF9800;         /* Orange (alerts) */

/* UI Elements */
--color-border: #E8D8C8;          /* Subtle borders */
--color-card-bg: #FFFFFF;         /* Card backgrounds */
--color-shadow: rgba(200, 150, 62, 0.15); /* Golden shadow */
```

### 2.2 Typography
```css
/* Font Families */
--font-serif: 'Playfair Display', Georgia, serif;     /* Headlines */
--font-sans: 'Inter', 'Segoe UI', sans-serif;        /* Body text */

/* Font Sizes */
--font-size-display: 48px;        /* Hero headlines */
--font-size-h1: 32px;             /* Main headlines */
--font-size-h2: 24px;             /* Subheadlines */
--font-size-h3: 20px;             /* Section titles */
--font-size-body: 18px;           /* Body text */
--font-size-small: 16px;          /* Small text */
--font-size-tiny: 14px;           /* Fine print */

/* Line Heights */
--line-height-tight: 1.2;         /* Headlines */
--line-height-normal: 1.5;        /* Body */
--line-height-relaxed: 1.7;       /* Long form */
```

### 2.3 Spacing System
```css
/* Base: 8px scale */
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-2xl: 64px;
--space-3xl: 96px;
```

### 2.4 Breakpoints
```css
/* Mobile First */
--breakpoint-mobile: 375px;       /* Base */
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1440px;
```

### 2.5 Border Radius
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

---

## 3. STEP-BY-STEP IMPLEMENTATION GUIDE

### PRELANDING PAGE (Before Quiz)

**Elements:**
- Hero headline: "Descubra o Bloqueio Invisível que Trava sua Prosperidade"
- Subheadline with social proof: "+3.800 mulheres já identificaram..."
- Photo of Mestra Renata Alves with verification badge
- Badge: "Numeróloga e Terapeuta Vibracional"
- Dynamic social proof counter: "+3.847 pessoas já fizeram..."
- CTA Button: "Descobrir meu bloqueio →"
- Subtle constellation elements in background (SVG)

**Design Notes:**
- Full viewport height on mobile
- Cream background (#FFF8F0)
- Gold serif typography for headline
- Trust elements prominently displayed

---

### PHASE 1 — O GANCHO (Steps 1-3)
*Objective: Curiosity + Mirroring + First Micro-commitment*

#### **STEP 1** | Single-Select Image
- **Type:** `single-select-image`
- **Advance:** Automatic on selection
- **Question:** "Como você descreveria sua relação com dinheiro hoje?"

**Options (4):**
1. **Travada** - "Frustrated woman looking at bills, hands on head"
2. **Instável** - "Worried woman looking at phone, doubtful"
3. **Limitada** - "Woman controlling spreadsheet, tired"
4. **Caótica** - "Messy desk with bills and cards"

**Design:**
- Vertical cards, full mobile width (375px)
- Photo on top, text overlay at bottom
- 12px border radius
- Subtle shadow
- Hover/tap state with golden border

**State to Store:**
```javascript
relationshipWithMoney: 'travada' | 'instavel' | 'limitada' | 'caotica'
```

---

#### **STEP 2** | Single-Select Image (Age Selection)
- **Type:** `single-select-image`
- **Advance:** Automatic on selection
- **Question:** "Qual sua faixa de idade?"
- **Subtitle:** *"Isso influencia diretamente o tipo de bloqueio predominante"*

**Options (4):**
1. **25 a 34 anos** - "Young Brazilian woman, modern look"
2. **35 a 44 anos** - "Brazilian woman, professional look"
3. **45 a 54 anos** - "Brazilian woman, elegant look"
4. **55+ anos** - "Brazilian woman, gray hair"

**Design Notes:**
- Same layout as Step 1
- Progress bar appears (~6%)
- This selection feeds dynamic text in Steps 3, 7, and 14

**State to Store:**
```javascript
ageRange: '25-34' | '35-44' | '45-54' | '55+'
```

---

#### **STEP 3** | Transition Statistic
- **Type:** `transition-statistic`
- **Advance:** Button "Continuar →"
- **Trigger:** Social proof + Normalization

**Content:**
```
"+3.847 mulheres na faixa dos {idade} anos já identificaram seu padrão de bloqueio"

87% relataram mudanças financeiras reais nas primeiras 4 semanas após descobrir QUANDO agir.
```

**Dynamic Text:**
- `{idade}` = age range from Step 2 (e.g., "35 aos 44")

**Design:**
- Large number "3.847" in display font (48px), gold color
- Percentage "87%" also prominent
- Subtle constellation icon in background (10% opacity)
- Centered layout
- Continue button at bottom

---

### PHASE 2 — O INVESTIMENTO (Steps 4-9)
*Objective: Sunk Cost + IKEA Effect + Emotional Pain Activation*

#### **STEP 4** | Single-Select Emoji
- **Type:** `single-select-emoji`
- **Advance:** Automatic on selection
- **Question:** "Qual área da sua vida está MAIS travada hoje?"

**Options (5):**
1. 💰 **Dinheiro e finanças**
2. 💼 **Carreira e propósito**
3. ❤️ **Relacionamentos**
4. 🧘 **Saúde e energia vital**
5. 🔒 **Tudo parece travado**

**Design:**
- Grid layout (2 columns on mobile, 3 on tablet+)
- Large emoji (48px) above text
- Option 5 (🔒) is the emotional anchor - most will select this

**State to Store:**
```javascript
blockedArea: 'dinheiro' | 'carreira' | 'relacionamentos' | 'saude' | 'tudo'
```

**Note:** The "🔒 Tudo parece travado" option amplifies pain and reinforces the blockage frame.

---

#### **STEP 5** | Single-Select Text (Binary)
- **Type:** `single-select-text`
- **Advance:** Automatic on selection
- **Question:** "Você sente que REPETE os mesmos padrões financeiros, mesmo quando muda de estratégia?"

**Options:**
1. ✅ **Sim, sempre volto ao mesmo lugar**
2. ❌ **Não, acho que é só falta de oportunidade**

**Design:**
- Large buttons (BR style)
- Green checkmark, red X
- "Sim" answer reinforces the "repetitive pattern" frame used in diagnosis

**State to Store:**
```javascript
repeatsPatterns: true | false
```

---

#### **STEP 6** | Single-Select Text (Binary)
- **Type:** `single-select-text`
- **Advance:** Automatic on selection
- **Question:** "O dinheiro que entra na sua vida costuma SUMIR rápido, como se escorresse pelas mãos?"

**Options:**
1. ✅ **Sim, é exatamente assim**
2. ❌ **Não, consigo manter**

**Copy Note:**
The metaphor "escorresse pelas mãos" (slips through hands) is deliberate - activates visceral, sensory pain. This response will be referenced in the diagnosis and Micro VSL.

**State to Store:**
```javascript
moneyDisappears: true | false
```

---

#### **STEP 7** | Transition Affirmation
- **Type:** `transition-affirmation`
- **Advance:** Button "Entendi →"
- **Trigger:** Barnum Effect + Reciprocity + Validation

**Content:**
```
"Isso não é coincidência."

Mulheres na faixa dos {idade} anos frequentemente carregam um bloqueio
energético que se manifesta como um ciclo: o dinheiro vem, cria esperança
— e depois some.

A boa notícia? Esse ciclo tem um padrão. E todo padrão pode ser mapeado.
```

**Dynamic Text:**
- `{idade}` = age range from Step 2

**Design:**
- Large serif title: "Isso não é coincidência."
- Golden triangle icon in background (10% opacity) - first visual appearance of "Triângulo de Desbloqueio"
- Empathetic, validating tone

**Why It Works:**
Barnum effect - the statement "money comes, creates hope, then disappears" is generic enough to resonate with anyone who selected financial problems, but personal enough to feel like a diagnosis.

---

#### **STEP 8** | Multi-Select Checkbox
- **Type:** `multi-select-checkbox`
- **Advance:** Button "Continuar" (enabled after 1st selection)
- **Trigger:** Sunk Cost + IKEA Effect + Investment

**Question:** "Quais desses sinais você reconhece na sua vida?"
**Subtitle:** *"Selecione todos que se aplicam"*

**Options (6):**
1. 💸 **Dinheiro entra e some sem explicação**
2. 🚫 **Projetos que nunca decolam de verdade**
3. 🔄 **Sensação de estar sempre recomeçando do zero**
4. 🧠 **Autossabotagem em momentos-chave**
5. 😶 **Medo de cobrar o que vale**
6. 🔒 **Sensação de que "não é pra mim"**

**Design:**
- Checkbox cards
- Selected state: golden border + filled checkbox
- Most users select 3-5 items
- Continue button fixed at bottom

**State to Store:**
```javascript
recognizedSigns: ['dinheiro-some', 'projetos-nao-decolam', 'recomecar', 'autossabotagem', 'medo-cobrar', 'nao-pra-mim']
```

**Note:** This is the highest cognitive/emotional investment screen. Each checkbox = "yes, this is me". IKEA effect makes user feel they're co-constructing their diagnosis. Selections will be referenced on result page.

---

#### **STEP 9** | Emoji Scale
- **Type:** `emoji-scale`
- **Advance:** Automatic on selection
- **Question:** "De 1 a 5, o quanto você sente que ALGO INVISÍVEL trava sua prosperidade?"

**Scale:**
```
😐        🤔        😕        😣        🔮
Nada     Pouco   Moderado   Muito   Totalmente
```

**Design:**
- Horizontal scale
- Large emojis (64px)
- Labels below each emoji
- Final emoji is 🔮 (crystal ball) instead of a face - subtle mystical reference

**State to Store:**
```javascript
invisibleBlockageLevel: 1 | 2 | 3 | 4 | 5
```

**Note:** Most users select 4 or 5, validating the frame. **This screen closes Phase 2 (PAIN)**.

---

### PHASE 3 — A REVELAÇÃO / PIVÔ (Step 10)
*Objective: Transition from PAIN → SOLUTION. Curiosity Gap + Future Visualization*

#### **STEP 10** | Transition Affirmation (PIVOT)
- **Type:** `transition-affirmation`
- **Advance:** Button "Ver meu diagnóstico →"
- **Trigger:** Curiosity Gap + Future Visualization

**Content:**
```
"Seu padrão tem nome. E tem data de validade."

O Triângulo de Desbloqueio cruza 3 dimensões — numerologia pessoal,
mapa astral e ciclos lunares — para identificar EXATAMENTE onde está
o bloqueio e, mais importante, QUANDO ele enfraquece.

Nos seus dias favoráveis, a trava afrouxa. É nesses dias que você precisa agir.
```

**Design:**
- **MOST IMPORTANT SCREEN** - the narrative pivot
- Tone shifts from therapeutic → revelatory
- Large serif gold title
- Animated Triangle de Desbloqueio graphic: triangle with 3 points that light up in sequence (numerologia → astrologia → lunar)
- Gold CTA button: "Ver meu diagnóstico →"

**Why It Works:**
- "Tem nome" = curiosity (what name?)
- "Tem data de validade" = hope (it will end)
- First reveal of the unique mechanism (Triângulo de Desbloqueio)
- CTA is not "buy" - it's "see my diagnosis", maintaining discovery frame

---

### PHASE 4 — O COMPROMETIMENTO (Step 11)
*Objective: Goal Gradient + Behavioral Consistency*

#### **STEP 11** | Single-Select Emoji
- **Type:** `single-select-emoji`
- **Advance:** Automatic on selection
- **Question:** "Quando você quer começar a destravar sua prosperidade?"

**Options (4):**
1. ⚡ **Hoje mesmo**
2. 📅 **Esta semana**
3. 🗓 **Este mês**
4. 🕐 **Quando sentir que é a hora**

**Design:**
- Progress bar >75%
- After 9 screens of saying "yes, I'm blocked" and "yes, I want to solve it", consistency pushes strongly toward "Hoje mesmo"

**State to Store:**
```javascript
whenToStart: 'hoje' | 'esta-semana' | 'este-mes' | 'quando-sentir'
```

**Note:** This is the closure of the Foot-in-the-Door loop - prepares for purchase.

---

### PHASE 5 — A CONVERSÃO (Steps 12-16)
*Objective: Labor Illusion + Loss Aversion + Anchoring + Authority*

#### **STEP 12** | Loading Screen
- **Type:** `transition-loading`
- **Duration:** 5 seconds
- **Trigger:** Labor Illusion + Anticipation

**Dynamic Text Sequence (fade every ~1.2s):**
1. "Mapeando seu Triângulo de Desbloqueio..."
2. "Cruzando numerologia pessoal + mapa astral + ciclos lunares..."
3. "Identificando o bloqueio nas 3 dimensões..."
4. "Calculando seus próximos dias favoráveis..."
5. "Seu diagnóstico está pronto!"

**Design:**
- Circular progress indicator (0% → 100%)
- Gold color (#C8963E)
- Cream background with subtle floating golden particles
- Each text fades smoothly

**Purpose:**
Simulates complex processing, increasing perceived value of result.

---

#### **STEP 13** | Email Capture
- **Type:** `email-capture`
- **Position:** AFTER loading, BEFORE result
- **Trigger:** Loss Aversion

**Content:**
```
"Seu Diagnóstico Tridimensional está pronto!"

Digite seu melhor email para salvar seu diagnóstico e receber
seus dias favoráveis do mês.
```

**Form:**
- Email input field (large, easy to tap)
- CTA button: "Ver meu diagnóstico →"
- Trust text: "🔒 Seus dados estão seguros. Sem spam."

**Validation:**
- Email format validation
- Required field
- Clear error messages

**Design:**
- Centered layout
- Large input field
- Prominent CTA button

**State to Store:**
```javascript
email: 'user@example.com'
```

**Why Here:**
After investing 11 screens + 5 seconds of loading, user will NOT abandon. Loss Aversion ("I won't lose everything I invested") guarantees 60-75% capture rates.

---

#### **STEP 14** | Result Page
- **Type:** `result-page`
- **Trigger:** Barnum Effect + Reciprocity + Future Visualization

**Header:**
"Seu Diagnóstico Tridimensional"

**Diagnosis Body (Barnum Template):**
```
"Mulheres na faixa dos {idade} anos com o perfil que você descreveu
apresentam um padrão claro: o bloqueio está concentrado na dimensão
{dimensão_predominante}.

Isso explica por que {sintoma_principal_selecionado} é tão recorrente
na sua vida.

A boa notícia é que seu Triângulo de Desbloqueio mostra janelas claras
de oportunidade. Nos próximos 30 dias, você tem {X} dias favoráveis em
que o bloqueio enfraquece — e é exatamente nesses dias que a ação gera
resultado real."
```

**Dynamic Variables:**
- `{idade}` = age range from Step 2
- `{dimensão_predominante}` = map from blockedArea (Step 4)
- `{sintoma_principal_selecionado}` = first item from recognizedSigns (Step 8)
- `{X}` = pseudo-random but consistent number based on age (e.g., 7-12 days)

**Visual Elements:**
1. Small photo of Mestra Renata + verification seal at top
2. Simplified Triangle diagram with 3 dimensions and scores
3. **BLURRED calendar preview** - "Intensidade do Bloqueio nos próximos 30 dias"
   - Wavy line graph showing valleys (favorable days) with gold star markers
   - Only 2-3 valleys visible, rest is blurred → creates urgency to unlock
4. CTA Button: "Desbloquear meu Calendário completo →"

**Design:**
- Scrollable page
- White cards on cream background
- Gold accents
- Graph creates visual intrigue

---

#### **STEP 15** | Micro VSL
- **Type:** `micro-vsl`
- **Duration:** 80 seconds
- **Presenter:** Mestra Renata Alves
- **Format:** Vertical video 9:16, auto-play muted with Portuguese captions
- **CTA:** Appears at 45s: "Quero meu Calendário de Abundância →"

**Video Script Structure:**

**HOOK (0-12s):**
"Se você respondeu que sente algo invisível travando sua prosperidade — e que o dinheiro entra e some como se escorresse pelas mãos — eu preciso te contar uma coisa que vai mudar sua forma de ver isso."

**PROBLEM AMPLIFICATION (12-30s):**
"O que acontece é que existe um padrão energético — um bloqueio real — que age nas 3 dimensões da sua vida: numerológica, astrológica e lunar. E esse bloqueio faz com que você repita os mesmos ciclos financeiros. Não é falta de esforço. Não é falta de merecimento. É um desalinhamento que nenhuma planilha ou curso de finanças resolve, porque o problema não é racional — é energético."

**MECHANISM REVEAL (30-50s):**
"Foi por isso que eu criei o Triângulo de Desbloqueio com o Calendário de Abundância. Diferente de um mapa astral genérico, ele cruza as 3 dimensões do seu perfil e mostra EXATAMENTE quais são os dias do mês em que o bloqueio está mais fraco. Nesses dias — e só nesses dias — a energia favorece a ação. É quando você deve tomar decisões financeiras, fechar negócios, pedir aumento, lançar um projeto. O calendário te avisa com antecedência."

**SOCIAL PROOF (50-62s):**
"Mais de 3.800 mulheres já usam o Calendário de Abundância. A Patrícia, de 42 anos, me disse que em 3 semanas agindo nos dias certos, fechou o maior contrato da carreira dela. A Fernanda pagou uma dívida de 4 anos em 2 meses. Não é mágica — é alinhamento."

**CTA + URGENCY (62-80s):**
"Clique no botão abaixo para acessar seu Diagnóstico Tridimensional completo e seu primeiro Calendário de Abundância por apenas R$ 4,90 nos primeiros 7 dias. Se não fizer sentido pra você, cancela e não paga mais nada. Mas se fizer — e eu acredito que vai — são apenas R$ 24,90 por mês para saber exatamente QUANDO agir. O próximo dia favorável pode ser amanhã. Não deixe ele passar."

**Design:**
- Video player with custom controls (gold theme)
- Captions enabled by default
- CTA button overlay appears at 45s (can click before video ends)

---

#### **STEP 16** | Checkout
- **Type:** `checkout`
- **Trigger:** Anchoring + Broken Price + Urgency

**Layout:**

| Element | Content |
|---------|---------|
| **Image** | Smartphone mockup showing Calendário de Abundância app |
| **Headline** | "Acesse seu Diagnóstico Completo + Calendário de Abundância" |
| **Anchoring Price** | ~~R$ 97,00/mês~~ (crossed out) |
| **Trial Price** | **R$ 4,90** (primeiros 7 dias) |
| **Renewal** | Depois: R$ 24,90/mês — cancele quando quiser |
| **CTA Button** | **QUERO MEU CALENDÁRIO DE ABUNDÂNCIA →** |
| **Guarantee** | "7 dias de garantia incondicional. Teste por R$ 4,90 — se não fizer sentido, cancele e não paga mais nada." |
| **Payment Methods** | Pix · Cartão · Boleto |
| **Trust Badges** | SSL · Compra Segura · Kiwify |

**Order Bump (Checkbox):**
```
✅ Sim! Quero adicionar o Guia com 21 Rituais de Desbloqueio
para potencializar meus dias favoráveis por apenas +R$ 17,00
(pagamento único)
```

**Design:**
- Clean, distraction-free layout
- Large CTA button (gold, prominent)
- Anchoring price crossed out clearly
- Guarantee prominently displayed
- Payment badges for trust
- Order bump in subtle box (converts 20-35%)

**State to Store:**
```javascript
checkoutInitiated: timestamp,
orderBumpSelected: true | false
```

---

## 4. STATE MANAGEMENT

### 4.1 User Response Object
```javascript
const userState = {
  // Metadata
  sessionId: 'uuid-v4',
  startTime: timestamp,
  currentStep: 0,
  completedSteps: [0, 1, 2, ...],

  // Step 1
  relationshipWithMoney: 'travada' | 'instavel' | 'limitada' | 'caotica',

  // Step 2
  ageRange: '25-34' | '35-44' | '45-54' | '55+',

  // Step 4
  blockedArea: 'dinheiro' | 'carreira' | 'relacionamentos' | 'saude' | 'tudo',

  // Step 5
  repeatsPatterns: true | false,

  // Step 6
  moneyDisappears: true | false,

  // Step 8 (array)
  recognizedSigns: ['dinheiro-some', 'projetos-nao-decolam', ...],

  // Step 9
  invisibleBlockageLevel: 1 | 2 | 3 | 4 | 5,

  // Step 11
  whenToStart: 'hoje' | 'esta-semana' | 'este-mes' | 'quando-sentir',

  // Step 13
  email: 'user@example.com',
  emailCapturedAt: timestamp,

  // Step 16
  checkoutInitiated: timestamp,
  orderBumpSelected: true | false,

  // Completion
  completionTime: timestamp,
  totalTimeSpent: seconds
};
```

### 4.2 Storage Strategy
```javascript
// Save on each step completion
localStorage.setItem('quizState', JSON.stringify(userState));

// Resume capability
const savedState = JSON.parse(localStorage.getItem('quizState'));

// Clear after purchase or 7 days
if (purchaseComplete || isExpired(7days)) {
  localStorage.removeItem('quizState');
}
```

---

## 5. DYNAMIC CONTENT LOGIC

### 5.1 Age-Based Text Replacement
Used in: Steps 3, 7, 14

```javascript
const ageText = {
  '25-34': '25 aos 34',
  '35-44': '35 aos 44',
  '45-54': '45 aos 54',
  '55+': '55 ou mais'
};

const dynamicText = `Mulheres na faixa dos ${ageText[userState.ageRange]} anos...`;
```

### 5.2 Diagnosis Generation (Step 14)
```javascript
// Map blocked area to dimension name
const dimensionMap = {
  'dinheiro': 'Financeira',
  'carreira': 'Profissional',
  'relacionamentos': 'Relacional',
  'saude': 'Vital',
  'tudo': 'Multidimensional'
};

// Get first recognized sign as primary symptom
const symptomMap = {
  'dinheiro-some': 'o dinheiro entra e some sem explicação',
  'projetos-nao-decolam': 'projetos que nunca decolam',
  // etc...
};

// Calculate favorable days (pseudo-random but consistent per user)
const favorableDays = calculateFavorableDays(userState.ageRange);

// Build diagnosis
const diagnosis = `
Mulheres na faixa dos ${ageText[userState.ageRange]} anos com o perfil
que você descreveu apresentam um padrão claro: o bloqueio está concentrado
na dimensão ${dimensionMap[userState.blockedArea]}.

Isso explica por que ${symptomMap[userState.recognizedSigns[0]]} é tão
recorrente na sua vida.

A boa notícia é que seu Triângulo de Desbloqueio mostra janelas claras
de oportunidade. Nos próximos 30 dias, você tem ${favorableDays} dias
favoráveis em que o bloqueio enfraquece — e é exatamente nesses dias
que a ação gera resultado real.
`;
```

---

## 6. NAVIGATION & PROGRESS

### 6.1 Progress Calculation
```javascript
const totalSteps = 16;
const progress = (currentStep / totalSteps) * 100;

// Key milestones:
// Step 2: ~12% (progress bar appears)
// Step 9: ~56% (end of Phase 2)
// Step 11: ~69%
// Step 16: 100%
```

### 6.2 Advance Logic
```javascript
const stepConfig = {
  1: { type: 'single-select-image', autoAdvance: true },
  2: { type: 'single-select-image', autoAdvance: true },
  3: { type: 'transition-statistic', autoAdvance: false },
  4: { type: 'single-select-emoji', autoAdvance: true },
  5: { type: 'single-select-text', autoAdvance: true },
  6: { type: 'single-select-text', autoAdvance: true },
  7: { type: 'transition-affirmation', autoAdvance: false },
  8: { type: 'multi-select-checkbox', autoAdvance: false },
  9: { type: 'emoji-scale', autoAdvance: true },
  10: { type: 'transition-affirmation', autoAdvance: false }, // PIVOT
  11: { type: 'single-select-emoji', autoAdvance: true },
  12: { type: 'transition-loading', autoAdvance: true, duration: 5000 },
  13: { type: 'email-capture', autoAdvance: false },
  14: { type: 'result-page', autoAdvance: false },
  15: { type: 'micro-vsl', autoAdvance: false },
  16: { type: 'checkout', autoAdvance: false }
};
```

### 6.3 Back Navigation
```javascript
// Allow back on all steps EXCEPT Step 16 (checkout)
const backButton = currentStep === 16 ? null : <BackButton />;

// Preserve answers when going back
// Don't re-trigger analytics events
```

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Progress Bar Component
```html
<div class="progress-bar-container">
  <div class="progress-bar-fill" style="width: {progress}%"></div>
  <span class="progress-text">{currentStep} de 16</span>
</div>
```
- Appears from Step 2 onwards
- Smooth width transition (300ms ease)
- Gold fill color
- Shows step count

### 7.2 Option Card Component (Images)
```html
<button class="option-card option-card--image" data-value="{value}">
  <img src="{imagePath}" alt="{altText}" />
  <div class="option-card__overlay">
    <span class="option-card__text">{optionText}</span>
  </div>
</button>
```
- Vertical cards
- Image with text overlay at bottom
- Hover: lift + golden border
- Active: golden border + scale down slightly

### 7.3 Option Card Component (Emoji)
```html
<button class="option-card option-card--emoji" data-value="{value}">
  <span class="option-card__emoji">{emoji}</span>
  <span class="option-card__text">{optionText}</span>
</button>
```
- Grid layout (2 columns mobile, 3+ tablet)
- Large emoji (48px)
- Text below
- Hover: background color change

### 7.4 Checkbox Card Component
```html
<label class="checkbox-card">
  <input type="checkbox" name="signs" value="{value}" />
  <div class="checkbox-card__content">
    <span class="checkbox-card__emoji">{emoji}</span>
    <span class="checkbox-card__text">{text}</span>
    <span class="checkbox-card__check">✓</span>
  </div>
</label>
```
- Selected: golden border + visible checkmark
- Unselected: gray border
- Smooth transitions

### 7.5 Loading Animation Component
```html
<div class="loading-screen">
  <div class="loading-circle">
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" />
    </svg>
    <span class="loading-percentage">{percent}%</span>
  </div>
  <p class="loading-text">{currentText}</p>
</div>
```
- Circular progress (CSS stroke-dashoffset animation)
- Text fades every 1.2s
- 5 total messages
- Gold color scheme

---

## 8. ANALYTICS & TRACKING

### 8.1 Events to Track
```javascript
// Google Analytics 4 / Facebook Pixel events
trackEvent('quiz_started', { timestamp });
trackEvent('step_completed', { stepNumber, stepType });
trackEvent('email_captured', { timestamp });
trackEvent('result_viewed', { timestamp });
trackEvent('vsl_started', { timestamp });
trackEvent('vsl_watched_45s', { timestamp }); // CTA appears
trackEvent('vsl_completed', { timestamp });
trackEvent('checkout_initiated', { timestamp });
trackEvent('order_bump_selected', { selected: true/false });
trackEvent('purchase_completed', { value, currency: 'BRL' });

// Drop-off tracking
trackEvent('quiz_abandoned', { lastStep, timeSpent });
```

### 8.2 Conversion Funnel Metrics
```
Prelanding Views
└─> Quiz Started (goal: 40%+)
    └─> Step 3 Reached (goal: 80%+)
        └─> Step 9 Completed (goal: 60%+)
            └─> Step 10 Pivot (goal: 90%+)
                └─> Email Captured (goal: 70%+)
                    └─> Result Viewed (goal: 95%+)
                        └─> VSL Started (goal: 80%+)
                            └─> Checkout Initiated (goal: 60%+)
                                └─> Purchase (goal: 5%+ of quiz starts)
```

---

## 9. IMPLEMENTATION PHASES

### PHASE 1: Foundation (Day 1)
**Estimated Time: 3-4 hours**

- [ ] Project setup (file structure)
- [ ] CSS variables and design system
- [ ] Base HTML structure (shell)
- [ ] State management module (`state.js`, `storage.js`)
- [ ] Navigation framework (`navigation.js`)
- [ ] Progress bar component
- [ ] Basic routing between steps

**Deliverable:** Empty quiz shell with navigation working

---

### PHASE 2: Prelanding + Steps 1-3 (Day 1-2)
**Estimated Time: 4-5 hours**

- [ ] Prelanding page (full design)
- [ ] Step 1: single-select-image component
- [ ] Step 2: single-select-image (age)
- [ ] Step 3: transition-statistic with dynamic text
- [ ] Image placeholder system
- [ ] Auto-advance logic
- [ ] Manual advance (button)

**Deliverable:** Working prelanding → Step 3 flow

---

### PHASE 3: Steps 4-9 (Day 2-3)
**Estimated Time: 5-6 hours**

- [ ] Step 4: single-select-emoji component
- [ ] Step 5: single-select-text (binary, styled)
- [ ] Step 6: single-select-text (binary)
- [ ] Step 7: transition-affirmation
- [ ] Step 8: multi-select-checkbox component
- [ ] Step 9: emoji-scale component
- [ ] Continue button enable/disable logic

**Deliverable:** Complete Phase 2 (Investment) flow

---

### PHASE 4: Step 10-11 (Day 3)
**Estimated Time: 2-3 hours**

- [ ] Step 10: transition-affirmation (PIVOT design)
- [ ] Triangle animation (3 points lighting up)
- [ ] Step 11: single-select-emoji (timing)
- [ ] Ensure tone shift is evident in design

**Deliverable:** Pivot point working

---

### PHASE 5: Steps 12-14 (Day 4)
**Estimated Time: 5-6 hours**

- [ ] Step 12: loading screen with 5-text sequence
- [ ] Circular progress animation
- [ ] Step 13: email capture with validation
- [ ] Step 14: result page layout
- [ ] Dynamic diagnosis generation logic
- [ ] Blurred calendar preview graphic
- [ ] Triangle diagram

**Deliverable:** Full diagnosis experience

---

### PHASE 6: Steps 15-16 (Day 4-5)
**Estimated Time: 4-5 hours**

- [ ] Step 15: video player integration
- [ ] Video placeholder or embed
- [ ] CTA overlay at 45s
- [ ] Step 16: checkout page layout
- [ ] Anchoring price display
- [ ] Order bump checkbox
- [ ] Payment method icons/badges
- [ ] Guarantee text prominent

**Deliverable:** Complete conversion flow

---

### PHASE 7: Polish & Integration (Day 5-6)
**Estimated Time: 4-5 hours**

- [ ] Smooth transitions between all steps
- [ ] Loading states
- [ ] Error handling (network, validation)
- [ ] Mobile responsive adjustments
- [ ] Tablet/desktop layouts
- [ ] Accessibility (keyboard navigation, ARIA)
- [ ] Analytics integration
- [ ] Email capture API/form action
- [ ] Checkout integration (payment gateway)

**Deliverable:** Production-ready quiz

---

### PHASE 8: Assets & Final QA (Day 6-7)
**Estimated Time: 3-4 hours**

- [ ] Replace image placeholders with real photos
- [ ] Mestra Renata photos
- [ ] Option images for Steps 1-2
- [ ] Authority verification badge
- [ ] Product mockups
- [ ] Font loading optimization
- [ ] Final cross-browser testing
- [ ] Performance audit (Lighthouse)
- [ ] Copy proofreading

**Deliverable:** Launch-ready

---

**TOTAL ESTIMATED TIME: 30-38 hours**
**Realistic Timeline: 7-10 working days**

---

## 10. TESTING CHECKLIST

### Functional Testing
- [ ] All 17 screens render correctly
- [ ] Auto-advance works on correct steps
- [ ] Manual advance (buttons) work
- [ ] Back button preserves answers
- [ ] Progress bar calculates correctly
- [ ] Email validation catches invalid emails
- [ ] Checkbox requires 1+ selection (Step 8)
- [ ] Dynamic text replaces correctly (Steps 3, 7, 14)
- [ ] Loading animation completes in 5s
- [ ] localStorage saves/loads state
- [ ] Resume quiz from any step works

### Browser Testing
- [ ] Chrome (desktop + mobile)
- [ ] Safari (macOS + iOS)
- [ ] Firefox
- [ ] Edge
- [ ] Samsung Internet (Android)

### Device Testing
- [ ] iPhone 12/13/14 (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad
- [ ] Desktop 1920px+
- [ ] Small mobile 375px

### Performance Testing
- [ ] Load time <3s on 3G
- [ ] Images optimized (WebP with fallback)
- [ ] Animations run at 60fps
- [ ] No layout shifts (CLS score)
- [ ] Lighthouse score >90

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] Form labels present

---

## 11. CONTENT ASSETS NEEDED

### Images (26 total)

**Prelanding (2):**
1. Mestra Renata Alves - professional photo + verification badge
2. Subtle constellation background (SVG)

**Step 1 - Options (4):**
1. Frustrated woman looking at bills (Travada)
2. Worried woman with phone (Instável)
3. Tired woman with spreadsheet (Limitada)
4. Messy desk with bills (Caótica)

**Step 2 - Options (4):**
1. Young Brazilian woman 25-34
2. Professional Brazilian woman 35-44
3. Elegant Brazilian woman 45-54
4. Gray-haired Brazilian woman 55+

**Step 10 - Triangle Animation:**
1. Triangle diagram SVG (animated)

**Step 14 - Result (3):**
1. Small Mestra Renata photo
2. Triangle diagram with scores
3. Blurred calendar graph

**Step 16 - Checkout (3):**
1. Smartphone mockup with calendar app
2. SSL badge
3. Kiwify logo

**Icons/Emojis:**
- Can use Unicode emojis (no image files needed)
- Or custom SVG icons for consistency

### Video (1)
**Step 15 - Micro VSL:**
- Duration: 80 seconds
- Format: Vertical 9:16 (1080x1920px ideal)
- Mestra Renata speaking to camera
- Portuguese subtitles burned in or as VTT file
- Auto-play compatible (muted)
- Hosting: Vimeo Pro, YouTube unlisted, or self-hosted

### Fonts (2)
**Google Fonts (CDN):**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 12. DEPLOYMENT

### Hosting Requirements
- Static site hosting (HTML/CSS/JS)
- HTTPS (required for localStorage, modern APIs)
- Custom domain support
- Fast CDN

### Recommended Platforms
1. **Vercel** (recommended - free tier, instant deploys)
2. **Netlify** (free tier, good performance)
3. **Cloudflare Pages** (free tier, fast)
4. **AWS S3 + CloudFront** (scalable, more setup)

### Deployment Steps
1. Build production bundle (minify CSS/JS)
2. Optimize images (compress, convert to WebP)
3. Set up custom domain
4. Configure environment variables (API keys)
5. Enable HTTPS
6. Set up analytics (GA4, Facebook Pixel)
7. Test on production URL
8. Monitor performance (Lighthouse, RUM)

### Environment Variables
```
# Email capture API
VITE_EMAIL_API_URL=https://api.example.com/capture

# Analytics
VITE_GA4_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=XXXXXXXXXXXXXXX

# Checkout/Payment
VITE_KIWIFY_PRODUCT_ID=XXXXXX
```

---

## 13. INTEGRATIONS

### Email Capture (Step 13)
**Options:**
1. **ConvertKit API** (email marketing)
2. **Mailchimp API**
3. **ActiveCampaign API**
4. **Custom backend** (save to database)
5. **Google Sheets** (via Apps Script)

**Implementation:**
```javascript
async function captureEmail(email, userData) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      tags: ['quiz-completed'],
      customFields: {
        ageRange: userData.ageRange,
        blockedArea: userData.blockedArea,
        // etc.
      }
    })
  });

  return response.ok;
}
```

### Checkout (Step 16)
**Kiwify Integration:**
```html
<!-- Redirect to Kiwify checkout -->
<form action="https://pay.kiwify.com.br/XXXXXXX" method="GET">
  <input type="hidden" name="email" value="{userEmail}">
  <input type="hidden" name="order_bump" value="{orderBump}">
  <button type="submit">QUERO MEU CALENDÁRIO →</button>
</form>
```

Or use Kiwify JavaScript SDK for embedded checkout.

### Analytics
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"></script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s) { /* FB Pixel code */ }
</script>
```

---

## 14. EMAIL FOLLOW-UP SEQUENCE

### Automated Emails (Post-Quiz)

**Email 1 - 1 hour after quiz completion**
- **Subject:** "Seu Diagnóstico Tridimensional está esperando ✨"
- **Content:** Recap diagnosis, CTA to claim trial (R$4.90)
- **Trigger:** Quiz completed, email captured, but no purchase

**Email 2 - 24 hours**
- **Subject:** "Você tem {X} dias favoráveis este mês — e está perdendo eles"
- **Content:** Loss aversion, urgency, limited discount (R$1.90 trial)
- **Trigger:** Still no purchase

**Email 3 - 48 hours**
- **Subject:** "{Nome}, posso te contar uma coisa?"
- **Content:** Personal tone from Mestra Renata, mini-story + testimonial
- **Trigger:** Still no purchase

**Email 4 - 72 hours**
- **Subject:** "Como a Patrícia destravou R$12.000 em 3 semanas"
- **Content:** Detailed social proof, final CTA (R$1.90 trial, last chance)
- **Trigger:** Final attempt

### Post-Purchase Emails
- Welcome email (onboarding)
- How to use the calendar
- Weekly favorable days reminder
- Monthly new calendar

---

## 15. SUCCESS METRICS & TARGETS

### Conversion Funnel Benchmarks

| Metric | Industry Benchmark | Target for C1 |
|--------|-------------------|---------------|
| Quiz Completion Rate | 45-55% | **55%+** |
| Email Capture Rate | 60-75% of completions | **70%** |
| Quiz → Trial Conversion | 3-6% | **5%+** |
| Order Bump Take Rate | 20-35% | **25%** |
| Trial → Subscriber (Month 1) | 50-65% | **60%** |
| Monthly Churn | 15-25% | **<20%** |
| ARPU (Annual) | - | **R$580-780** |

### Key Performance Indicators (KPIs)
- **CAC (Customer Acquisition Cost):** Target <R$50
- **LTV (Lifetime Value):** Target R$400-600
- **LTV:CAC Ratio:** Target 8:1 or better
- **Break-even:** Within 1-2 months

---

## 16. OPTIMIZATION OPPORTUNITIES (Post-Launch)

### A/B Testing Ideas
1. **Prelanding headline variations**
   - Test different pain points
   - Test curiosity vs. clarity

2. **Step 10 (Pivot) variations**
   - Test different mechanism explanations
   - Test CTA button copy

3. **Pricing tests**
   - R$4.90 vs R$1.90 trial
   - R$24.90 vs R$19.90 monthly

4. **Order bump variations**
   - Different bonus offers
   - Different price points

5. **VSL tests**
   - Different presenters
   - Different lengths
   - Script variations

### Conversion Rate Optimization (CRO)
- Heat mapping (Hotjar, Microsoft Clarity)
- Session recordings
- Exit-intent surveys
- Drop-off analysis

---

## 17. RISK MITIGATION

### Technical Risks
- **Risk:** Browser compatibility issues
  - **Mitigation:** Cross-browser testing, polyfills

- **Risk:** Slow load times hurt conversion
  - **Mitigation:** Image optimization, lazy loading, CDN

- **Risk:** localStorage data loss
  - **Mitigation:** Also use sessionStorage as backup

### Business Risks
- **Risk:** High churn rate
  - **Mitigation:** Strong onboarding, weekly value delivery (calendar updates)

- **Risk:** Low email capture rate
  - **Mitigation:** Position after maximum investment (Step 12 loading)

- **Risk:** Payment processor issues
  - **Mitigation:** Multiple payment methods (Pix, card, boleto)

---

## 18. LAUNCH CHECKLIST

### Pre-Launch
- [ ] All 17 screens tested and working
- [ ] Mobile responsive on all devices
- [ ] Email capture integrated and tested
- [ ] Checkout flow tested (test mode)
- [ ] Analytics tracking verified
- [ ] All copy proofread (Portuguese)
- [ ] Real images uploaded
- [ ] Video encoded and hosted
- [ ] Domain configured with HTTPS
- [ ] Privacy policy page created
- [ ] Terms of service page created

### Launch Day
- [ ] Deploy to production
- [ ] Verify all URLs work
- [ ] Test complete user flow end-to-end
- [ ] Monitor error logs
- [ ] Check analytics tracking
- [ ] Send test purchase
- [ ] Verify email automation triggers

### Post-Launch (Week 1)
- [ ] Monitor conversion funnel daily
- [ ] Identify drop-off points
- [ ] Review session recordings
- [ ] Check for JavaScript errors
- [ ] Monitor page load speeds
- [ ] Gather initial user feedback
- [ ] Adjust as needed

---

## 19. NEXT STEPS

### Immediate Actions
1. ✅ **Review and approve this plan**
2. **Decision: Do you have the image/video assets, or do we use placeholders?**
3. **Decision: Do you have email capture/checkout APIs ready, or use placeholders?**
4. **Set up project repository** (GitHub/Git)
5. **Begin Phase 1 implementation**

### Questions to Answer Before Starting
1. **Assets:** Real images available or placeholder approach?
2. **Video:** Do you have the 80s VSL with Mestra Renata?
3. **Email:** Which email service provider? (ConvertKit, Mailchimp, etc.)
4. **Payments:** Kiwify account set up? Product ID available?
5. **Domain:** Do you have a domain, or deploy on free subdomain first?
6. **Timeline:** What's your target launch date?

---

## 20. CONCLUSION

This quiz funnel is a **sophisticated psychological conversion machine** that leverages:

✅ **12+ behavioral psychology principles**
✅ **5-phase emotional journey** (Pain → Pivot → Solution)
✅ **Dynamic personalization** (Barnum effect)
✅ **Strategic friction points** (email capture after max investment)
✅ **Proven pricing psychology** (anchoring, trial, order bump)

**Estimated Development Time:** 30-38 hours (7-10 days)
**Tech Complexity:** Medium (vanilla JS, no framework needed)
**Conversion Potential:** High (targets 5%+ quiz→trial)

**The plan is comprehensive and ready for implementation.**

---

**Ready to start building? Let me know which phase to begin with, or if you have questions about any section.** 🚀
