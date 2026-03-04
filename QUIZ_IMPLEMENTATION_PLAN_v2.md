# Quiz Funnel C1 - Implementation Plan v2.0
## "Do Bloqueio ao Calendário" - Full-Stack Application

**Updated Architecture:** Python Flask + React + PostgreSQL + Docker + Clean Architecture

---

## EXECUTIVE SUMMARY

**Project:** Interactive quiz funnel SaaS for astrology/prosperity subscription service
**Target Audience:** Brazilian women aged 30-55 frustrated with recurring financial blocks
**Total Screens:** 17 (1 prelanding + 16 quiz steps)
**Conversion Model:** R$4.90 trial (7 days) → R$24.90/month subscription
**Authority Figure:** Mestra Renata Alves (Numerologist & Vibrational Therapist)

**NEW REQUIREMENTS:**
- ✅ Multi-user platform with authentication
- ✅ Backend API with Python Flask
- ✅ Modern React frontend with Vite
- ✅ PostgreSQL database
- ✅ Clean Architecture principles
- ✅ Docker containerization
- ✅ Scalable for multiple users and future features

---

## 1. TECHNICAL ARCHITECTURE

### 1.1 Technology Stack

#### Backend
- **Language:** Python 3.11+
- **Framework:** Flask 3.0+ with Flask-RESTful
- **Architecture:** Clean Architecture (Domain-driven design)
- **ORM:** SQLAlchemy 2.0+
- **Migrations:** Alembic
- **Authentication:** Flask-JWT-Extended
- **Validation:** Marshmallow / Pydantic
- **Task Queue:** Celery + Redis (for emails, analytics)
- **Testing:** pytest, pytest-cov

#### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite 5+
- **Language:** TypeScript
- **State Management:** Zustand or React Context + hooks
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS + CSS Modules
- **Testing:** Vitest + React Testing Library

#### Database
- **Primary DB:** PostgreSQL 16+
- **Caching:** Redis 7+
- **Migrations:** Alembic
- **Connection Pooling:** pgBouncer (production)

#### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Process Manager:** Gunicorn (backend)
- **CI/CD:** GitHub Actions
- **Hosting:** AWS/DigitalOcean/Railway

### 1.2 Why This Stack?

**Backend (Flask + Python):**
- ✅ Fast development, perfect for MVPs
- ✅ Excellent for data processing (dynamic diagnosis)
- ✅ Great ecosystem for payments, emails, analytics
- ✅ Easy to scale with Celery for background tasks
- ✅ Clean Architecture possible with proper structure

**Frontend (React + Vite):**
- ✅ Modern, fast, great DX
- ✅ Component reusability across quiz steps
- ✅ Strong TypeScript support
- ✅ Hot module replacement (HMR) for dev speed
- ✅ Excellent for complex state management

**PostgreSQL:**
- ✅ ACID compliance for transactions (payments)
- ✅ Excellent for user management, subscriptions
- ✅ JSON support for flexible quiz responses
- ✅ Robust, production-ready

**Docker:**
- ✅ Consistent dev/prod environments
- ✅ Easy local development setup
- ✅ Simplified deployment
- ✅ Service isolation (DB, Redis, backend, frontend)

---

## 2. PROJECT STRUCTURE (Clean Architecture)

```
quiz-funnel-c1/
│
├── docker-compose.yml              # Multi-container orchestration
├── .env.example                    # Environment variables template
├── .gitignore
├── README.md
│
├── backend/                        # Python Flask Backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── alembic.ini
│   ├── pytest.ini
│   ├── .env
│   │
│   ├── src/
│   │   ├── __init__.py
│   │   ├── app.py                 # Flask app factory
│   │   ├── config.py              # Configuration classes
│   │   │
│   │   ├── domain/                # Domain Layer (Business Logic)
│   │   │   ├── __init__.py
│   │   │   ├── entities/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py
│   │   │   │   ├── quiz_response.py
│   │   │   │   ├── subscription.py
│   │   │   │   └── diagnosis.py
│   │   │   ├── value_objects/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── email.py
│   │   │   │   ├── age_range.py
│   │   │   │   └── price.py
│   │   │   └── services/
│   │   │       ├── __init__.py
│   │   │       ├── diagnosis_service.py
│   │   │       ├── triangle_calculator.py
│   │   │       └── barnum_generator.py
│   │   │
│   │   ├── application/           # Application Layer (Use Cases)
│   │   │   ├── __init__.py
│   │   │   ├── use_cases/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── start_quiz.py
│   │   │   │   ├── save_step_response.py
│   │   │   │   ├── generate_diagnosis.py
│   │   │   │   ├── capture_email.py
│   │   │   │   ├── create_subscription.py
│   │   │   │   └── authenticate_user.py
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   ├── __init__.py
│   │   │   │   ├── quiz_dto.py
│   │   │   │   └── user_dto.py
│   │   │   └── interfaces/        # Port interfaces
│   │   │       ├── __init__.py
│   │   │       ├── repositories.py
│   │   │       ├── email_service.py
│   │   │       └── payment_service.py
│   │   │
│   │   ├── infrastructure/        # Infrastructure Layer (Adapters)
│   │   │   ├── __init__.py
│   │   │   ├── database/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── models.py      # SQLAlchemy models
│   │   │   │   ├── session.py     # Database session
│   │   │   │   └── repositories/
│   │   │   │       ├── __init__.py
│   │   │   │       ├── user_repository.py
│   │   │   │       ├── quiz_repository.py
│   │   │   │       └── subscription_repository.py
│   │   │   ├── external_services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── email_service.py     # SendGrid/Mailgun
│   │   │   │   ├── payment_service.py   # Kiwify integration
│   │   │   │   └── analytics_service.py # GA4, Facebook Pixel
│   │   │   └── cache/
│   │   │       ├── __init__.py
│   │   │       └── redis_cache.py
│   │   │
│   │   ├── presentation/          # Presentation Layer (API)
│   │   │   ├── __init__.py
│   │   │   ├── api/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── v1/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   ├── auth.py
│   │   │   │   │   │   ├── quiz.py
│   │   │   │   │   │   ├── diagnosis.py
│   │   │   │   │   │   ├── subscription.py
│   │   │   │   │   │   └── user.py
│   │   │   │   │   └── schemas/
│   │   │   │   │       ├── __init__.py
│   │   │   │   │       ├── auth_schema.py
│   │   │   │   │       ├── quiz_schema.py
│   │   │   │   │       └── user_schema.py
│   │   │   ├── middleware/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── error_handler.py
│   │   │   │   └── cors.py
│   │   │   └── validators/
│   │   │       ├── __init__.py
│   │   │       └── request_validators.py
│   │   │
│   │   └── shared/                # Shared utilities
│   │       ├── __init__.py
│   │       ├── exceptions.py
│   │       ├── utils.py
│   │       └── constants.py
│   │
│   ├── migrations/                # Alembic migrations
│   │   ├── versions/
│   │   └── env.py
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── unit/
│       │   ├── domain/
│       │   ├── application/
│       │   └── infrastructure/
│       └── integration/
│           └── api/
│
├── frontend/                      # React Frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env
│   │
│   ├── public/
│   │   ├── images/
│   │   │   ├── authority/
│   │   │   ├── options/
│   │   │   └── mockups/
│   │   └── videos/
│   │
│   └── src/
│       ├── main.tsx               # Entry point
│       ├── App.tsx
│       ├── vite-env.d.ts
│       │
│       ├── pages/                 # Page components
│       │   ├── Prelanding.tsx
│       │   ├── QuizFlow.tsx
│       │   ├── Dashboard.tsx
│       │   └── Auth/
│       │       ├── Login.tsx
│       │       └── Register.tsx
│       │
│       ├── components/            # Reusable components
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── Container.tsx
│       │   ├── quiz/
│       │   │   ├── ProgressBar.tsx
│       │   │   ├── QuizStep.tsx
│       │   │   ├── StepTypes/
│       │   │   │   ├── SingleSelectImage.tsx
│       │   │   │   ├── SingleSelectEmoji.tsx
│       │   │   │   ├── SingleSelectText.tsx
│       │   │   │   ├── MultiSelectCheckbox.tsx
│       │   │   │   ├── EmojiScale.tsx
│       │   │   │   ├── TransitionStatistic.tsx
│       │   │   │   ├── TransitionAffirmation.tsx
│       │   │   │   ├── LoadingScreen.tsx
│       │   │   │   ├── EmailCapture.tsx
│       │   │   │   ├── ResultPage.tsx
│       │   │   │   ├── MicroVSL.tsx
│       │   │   │   └── Checkout.tsx
│       │   │   └── OptionCard.tsx
│       │   ├── common/
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Modal.tsx
│       │   │   └── Loading.tsx
│       │   └── ui/                # Shadcn/UI components (if using)
│       │
│       ├── features/              # Feature modules
│       │   ├── auth/
│       │   │   ├── hooks/
│       │   │   ├── api/
│       │   │   └── types/
│       │   ├── quiz/
│       │   │   ├── hooks/
│       │   │   │   ├── useQuizState.ts
│       │   │   │   └── useQuizNavigation.ts
│       │   │   ├── api/
│       │   │   │   └── quizApi.ts
│       │   │   ├── types/
│       │   │   │   └── quiz.types.ts
│       │   │   └── utils/
│       │   │       └── dynamicContent.ts
│       │   └── subscription/
│       │
│       ├── store/                 # State management
│       │   ├── authStore.ts
│       │   ├── quizStore.ts
│       │   └── userStore.ts
│       │
│       ├── services/              # API clients
│       │   ├── api.ts             # Axios instance
│       │   ├── authService.ts
│       │   ├── quizService.ts
│       │   └── subscriptionService.ts
│       │
│       ├── hooks/                 # Global custom hooks
│       │   ├── useAuth.ts
│       │   ├── useLocalStorage.ts
│       │   └── useAnalytics.ts
│       │
│       ├── utils/                 # Utility functions
│       │   ├── validators.ts
│       │   ├── formatters.ts
│       │   └── constants.ts
│       │
│       ├── types/                 # TypeScript types
│       │   ├── api.types.ts
│       │   ├── user.types.ts
│       │   └── quiz.types.ts
│       │
│       ├── styles/                # Global styles
│       │   ├── globals.css
│       │   ├── variables.css
│       │   └── tailwind.css
│       │
│       └── assets/                # Static assets
│           ├── fonts/
│           └── icons/
│
├── nginx/                         # Nginx configuration
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ssl/                       # SSL certificates (production)
│
└── scripts/                       # Utility scripts
    ├── setup-dev.sh
    ├── run-tests.sh
    └── deploy.sh
```

---

## 3. DATABASE SCHEMA (PostgreSQL)

### 3.1 Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│     users       │         │  quiz_sessions   │         │  subscriptions  │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ id (PK)         │◄────┐   │ id (PK)          │    ┌───►│ id (PK)         │
│ email           │     │   │ user_id (FK)     │    │    │ user_id (FK)    │
│ password_hash   │     └───│ session_token    │    │    │ status          │
│ name            │         │ current_step     │    │    │ plan            │
│ created_at      │         │ started_at       │    │    │ trial_ends_at   │
│ updated_at      │         │ completed_at     │    │    │ current_period_start│
│ last_login      │         │ is_completed     │    │    │ current_period_end  │
│ is_active       │         │ responses (JSON) │    │    │ created_at      │
│ email_verified  │         │ created_at       │    │    │ updated_at      │
└─────────────────┘         │ updated_at       │    │    │ canceled_at     │
                            └──────────────────┘    │    └─────────────────┘
                                     │              │
                                     │              │
                                     └──────────────┘

┌─────────────────┐         ┌──────────────────┐
│    diagnoses    │         │  email_captures  │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ user_id (FK)    │         │ email            │
│ session_id (FK) │         │ quiz_data (JSON) │
│ diagnosis_text  │         │ source           │
│ favorable_days  │         │ captured_at      │
│ blocked_area    │         │ converted_at     │
│ blockage_level  │         │ is_converted     │
│ created_at      │         └──────────────────┘
└─────────────────┘

┌─────────────────┐         ┌──────────────────┐
│ payment_events  │         │  analytics_events│
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ user_id (FK)    │         │ session_id       │
│ subscription_id │         │ event_type       │
│ amount          │         │ event_data (JSON)│
│ currency        │         │ user_id (FK)     │
│ status          │         │ created_at       │
│ provider        │         └──────────────────┘
│ provider_id     │
│ created_at      │
└─────────────────┘
```

### 3.2 SQL Schema Definition

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Quiz sessions table
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    current_step INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    responses JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_session_token ON quiz_sessions(session_token);
CREATE INDEX idx_quiz_sessions_completed ON quiz_sessions(is_completed);

-- Diagnoses table
CREATE TABLE diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    diagnosis_text TEXT NOT NULL,
    favorable_days INT NOT NULL,
    blocked_area VARCHAR(50) NOT NULL,
    blockage_level INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diagnoses_user_id ON diagnoses(user_id);
CREATE INDEX idx_diagnoses_session_id ON diagnoses(session_id);

-- Email captures table (for non-registered users)
CREATE TABLE email_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    quiz_data JSONB DEFAULT '{}',
    source VARCHAR(50) DEFAULT 'quiz',
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_at TIMESTAMP,
    is_converted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_email_captures_email ON email_captures(email);
CREATE INDEX idx_email_captures_converted ON email_captures(is_converted);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'trial', 'active', 'canceled', 'expired'
    plan VARCHAR(50) NOT NULL, -- 'trial', 'monthly'
    trial_ends_at TIMESTAMP,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canceled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payment events table
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
    provider VARCHAR(50) NOT NULL, -- 'kiwify', 'stripe', etc.
    provider_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX idx_payment_events_status ON payment_events(status);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL, -- 'quiz_started', 'step_completed', 'email_captured', etc.
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
```

---

## 4. API ENDPOINTS

### 4.1 Authentication Endpoints

```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/refresh           # Refresh JWT token
POST   /api/v1/auth/verify-email      # Verify email
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password
```

### 4.2 Quiz Endpoints

```
POST   /api/v1/quiz/start             # Start new quiz session
GET    /api/v1/quiz/session/:token    # Get quiz session state
POST   /api/v1/quiz/step              # Save step response
POST   /api/v1/quiz/email             # Capture email (Step 13)
GET    /api/v1/quiz/resume/:token     # Resume incomplete quiz
```

### 4.3 Diagnosis Endpoints

```
POST   /api/v1/diagnosis/generate     # Generate diagnosis (Step 14)
GET    /api/v1/diagnosis/:id          # Get diagnosis by ID
GET    /api/v1/diagnosis/user/:userId # Get user's diagnoses
```

### 4.4 Subscription Endpoints

```
POST   /api/v1/subscriptions/create   # Create subscription (checkout)
GET    /api/v1/subscriptions/user/:id # Get user subscription
PUT    /api/v1/subscriptions/:id      # Update subscription
DELETE /api/v1/subscriptions/:id      # Cancel subscription
POST   /api/v1/subscriptions/webhook  # Payment webhook
```

### 4.5 User Endpoints

```
GET    /api/v1/users/me               # Get current user
PUT    /api/v1/users/me               # Update current user
GET    /api/v1/users/:id/calendar     # Get user's calendar
```

### 4.6 Analytics Endpoints

```
POST   /api/v1/analytics/event        # Track event
GET    /api/v1/analytics/funnel       # Get funnel metrics (admin)
```

---

## 5. API REQUEST/RESPONSE EXAMPLES

### 5.1 Start Quiz
```http
POST /api/v1/quiz/start
Content-Type: application/json

{
  "source": "prelanding",
  "utm_params": {
    "utm_source": "facebook",
    "utm_campaign": "q1-2026"
  }
}

Response 201:
{
  "session_token": "abc-def-ghi-jkl",
  "current_step": 0,
  "started_at": "2026-03-04T20:00:00Z"
}
```

### 5.2 Save Step Response
```http
POST /api/v1/quiz/step
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "step": 1,
  "step_type": "single-select-image",
  "response": {
    "answer": "travada"
  }
}

Response 200:
{
  "step": 1,
  "next_step": 2,
  "progress": 6.25,
  "saved_at": "2026-03-04T20:01:00Z"
}
```

### 5.3 Generate Diagnosis
```http
POST /api/v1/diagnosis/generate
Content-Type: application/json
Authorization: Bearer {session_token}

{
  "session_id": "abc-def-ghi-jkl"
}

Response 200:
{
  "id": "diagnosis-uuid",
  "diagnosis_text": "Mulheres na faixa dos 35 aos 44 anos...",
  "favorable_days": 9,
  "blocked_area": "dinheiro",
  "blockage_level": 4,
  "triangle_scores": {
    "numerology": 65,
    "astrology": 72,
    "lunar": 58
  },
  "calendar_preview": {
    "visible_days": [7, 14, 21],
    "total_days": 9
  },
  "created_at": "2026-03-04T20:10:00Z"
}
```

---

## 6. DOCKER SETUP

### 6.1 docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:16-alpine
    container_name: quiz-funnel-db
    environment:
      POSTGRES_DB: quiz_funnel
      POSTGRES_USER: quiz_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U quiz_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: quiz-funnel-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Backend (Flask)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: quiz-funnel-backend
    environment:
      FLASK_APP: src.app
      FLASK_ENV: development
      DATABASE_URL: postgresql://quiz_user:${DB_PASSWORD}@db:5432/quiz_funnel
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: ${SECRET_KEY}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
    volumes:
      - ./backend:/app
      - backend_logs:/app/logs
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: flask run --host=0.0.0.0 --port=5000 --reload

  # Celery Worker (Background tasks)
  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: quiz-funnel-celery
    environment:
      DATABASE_URL: postgresql://quiz_user:${DB_PASSWORD}@db:5432/quiz_funnel
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: ${SECRET_KEY}
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis
      - backend
    command: celery -A src.tasks worker --loglevel=info

  # Frontend (React + Vite)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: quiz-funnel-frontend
    environment:
      VITE_API_URL: http://localhost:5000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - backend
    command: npm run dev -- --host

  # Nginx (Reverse Proxy)
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: quiz-funnel-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_data:
  backend_logs:
```

### 6.2 Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt requirements-dev.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Run migrations and start app
CMD ["sh", "-c", "alembic upgrade head && flask run --host=0.0.0.0 --port=5000"]
```

### 6.3 Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Development stage
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM base AS builder
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 7. ENVIRONMENT VARIABLES

### 7.1 Backend (.env)

```bash
# Flask
FLASK_APP=src.app
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database
DATABASE_URL=postgresql://quiz_user:password@localhost:5432/quiz_funnel
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=0

# Redis
REDIS_URL=redis://localhost:6379/0

# Email Service (SendGrid/Mailgun)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@seucalendario.com
EMAIL_FROM_NAME=Mestra Renata Alves

# Payment Service (Kiwify)
KIWIFY_API_KEY=your-kiwify-api-key
KIWIFY_PRODUCT_ID=your-product-id
KIWIFY_WEBHOOK_SECRET=your-webhook-secret

# Analytics
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
FB_PIXEL_ID=XXXXXXXXXXXXXXX

# Security
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour
JWT_REFRESH_TOKEN_EXPIRES=2592000  # 30 days

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### 7.2 Frontend (.env)

```bash
# API
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=30000

# Analytics
VITE_GA4_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=XXXXXXXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SOCIAL_SHARE=false

# Payment
VITE_KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br
```

---

## 8. CLEAN ARCHITECTURE IMPLEMENTATION

### 8.1 Domain Layer Example

**backend/src/domain/entities/quiz_response.py**
```python
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Any, Optional
from uuid import UUID

@dataclass
class QuizResponse:
    """Quiz response entity - pure business logic, no dependencies"""

    id: UUID
    session_id: UUID
    user_id: Optional[UUID]
    current_step: int
    responses: Dict[str, Any]
    started_at: datetime
    completed_at: Optional[datetime]
    is_completed: bool

    def add_step_response(self, step: int, response: Any) -> None:
        """Add response for a specific step"""
        self.responses[f"step_{step}"] = response
        self.current_step = step

    def complete(self) -> None:
        """Mark quiz as completed"""
        self.is_completed = True
        self.completed_at = datetime.utcnow()

    def get_age_range(self) -> Optional[str]:
        """Extract age range from responses"""
        return self.responses.get('step_2', {}).get('answer')

    def get_blocked_area(self) -> Optional[str]:
        """Extract blocked area from responses"""
        return self.responses.get('step_4', {}).get('answer')
```

**backend/src/domain/services/diagnosis_service.py**
```python
from typing import Dict, List
from ..entities.quiz_response import QuizResponse
from ..value_objects.age_range import AgeRange

class DiagnosisService:
    """Domain service for generating diagnoses"""

    def generate_diagnosis(self, quiz_response: QuizResponse) -> Dict[str, any]:
        """Generate personalized diagnosis based on quiz responses"""

        age_range = quiz_response.get_age_range()
        blocked_area = quiz_response.get_blocked_area()
        signs = quiz_response.responses.get('step_8', [])
        blockage_level = quiz_response.responses.get('step_9', 3)

        # Business logic for diagnosis generation
        diagnosis_text = self._generate_barnum_text(
            age_range, blocked_area, signs
        )
        favorable_days = self._calculate_favorable_days(age_range, blockage_level)

        return {
            'diagnosis_text': diagnosis_text,
            'favorable_days': favorable_days,
            'blocked_area': blocked_area,
            'blockage_level': blockage_level,
            'triangle_scores': self._calculate_triangle_scores(quiz_response)
        }

    def _generate_barnum_text(
        self, age_range: str, blocked_area: str, signs: List[str]
    ) -> str:
        """Generate Barnum effect diagnosis text"""
        age_text_map = {
            '25-34': '25 aos 34',
            '35-44': '35 aos 44',
            '45-54': '45 aos 54',
            '55+': '55 ou mais'
        }

        dimension_map = {
            'dinheiro': 'Financeira',
            'carreira': 'Profissional',
            'relacionamentos': 'Relacional',
            'saude': 'Vital',
            'tudo': 'Multidimensional'
        }

        symptom_map = {
            'dinheiro-some': 'o dinheiro entra e some sem explicação',
            'projetos-nao-decolam': 'projetos que nunca decolam',
            # ... etc
        }

        primary_symptom = symptom_map.get(signs[0], 'bloqueios recorrentes')

        return f"""
Mulheres na faixa dos {age_text_map[age_range]} anos com o perfil que você
descreveu apresentam um padrão claro: o bloqueio está concentrado na dimensão
{dimension_map[blocked_area]}.

Isso explica por que {primary_symptom} é tão recorrente na sua vida.

A boa notícia é que seu Triângulo de Desbloqueio mostra janelas claras de
oportunidade. Nos próximos 30 dias, você tem dias favoráveis em que o bloqueio
enfraquece — e é exatamente nesses dias que a ação gera resultado real.
        """.strip()

    def _calculate_favorable_days(self, age_range: str, blockage_level: int) -> int:
        """Calculate number of favorable days"""
        # Pseudo-random but consistent calculation
        base_days = {
            '25-34': 10,
            '35-44': 9,
            '45-54': 8,
            '55+': 7
        }

        adjustment = (5 - blockage_level) * 0.5
        return max(5, min(12, int(base_days[age_range] + adjustment)))

    def _calculate_triangle_scores(self, quiz_response: QuizResponse) -> Dict[str, int]:
        """Calculate triangle dimension scores"""
        # Business logic for triangle calculation
        return {
            'numerology': 65,
            'astrology': 72,
            'lunar': 58
        }
```

### 8.2 Application Layer Example

**backend/src/application/use_cases/save_step_response.py**
```python
from dataclasses import dataclass
from typing import Dict, Any
from uuid import UUID

from ...domain.entities.quiz_response import QuizResponse
from ..interfaces.repositories import QuizRepository
from ...shared.exceptions import QuizSessionNotFound

@dataclass
class SaveStepResponseInput:
    session_token: str
    step: int
    response: Dict[str, Any]

@dataclass
class SaveStepResponseOutput:
    step: int
    next_step: int
    progress: float
    saved_at: str

class SaveStepResponseUseCase:
    """Use case for saving step responses"""

    def __init__(self, quiz_repository: QuizRepository):
        self.quiz_repository = quiz_repository

    def execute(self, input_dto: SaveStepResponseInput) -> SaveStepResponseOutput:
        """Execute the use case"""

        # Get quiz session
        session = self.quiz_repository.get_by_token(input_dto.session_token)
        if not session:
            raise QuizSessionNotFound(f"Session {input_dto.session_token} not found")

        # Add response to session
        session.add_step_response(input_dto.step, input_dto.response)

        # Save to repository
        self.quiz_repository.save(session)

        # Calculate progress
        total_steps = 16
        progress = (input_dto.step / total_steps) * 100

        return SaveStepResponseOutput(
            step=input_dto.step,
            next_step=input_dto.step + 1,
            progress=progress,
            saved_at=session.updated_at.isoformat()
        )
```

### 8.3 Infrastructure Layer Example

**backend/src/infrastructure/database/repositories/quiz_repository.py**
```python
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from ....domain.entities.quiz_response import QuizResponse
from ....application.interfaces.repositories import QuizRepository
from ..models import QuizSessionModel

class SQLAlchemyQuizRepository(QuizRepository):
    """SQLAlchemy implementation of QuizRepository"""

    def __init__(self, db_session: Session):
        self.db_session = db_session

    def save(self, quiz_response: QuizResponse) -> QuizResponse:
        """Save quiz response to database"""
        model = self.db_session.query(QuizSessionModel).filter_by(
            id=quiz_response.id
        ).first()

        if model:
            # Update existing
            model.current_step = quiz_response.current_step
            model.responses = quiz_response.responses
            model.is_completed = quiz_response.is_completed
            model.completed_at = quiz_response.completed_at
        else:
            # Create new
            model = QuizSessionModel(
                id=quiz_response.id,
                session_token=quiz_response.session_token,
                user_id=quiz_response.user_id,
                current_step=quiz_response.current_step,
                responses=quiz_response.responses,
                started_at=quiz_response.started_at,
                is_completed=quiz_response.is_completed
            )
            self.db_session.add(model)

        self.db_session.commit()
        self.db_session.refresh(model)

        return self._to_entity(model)

    def get_by_token(self, session_token: str) -> Optional[QuizResponse]:
        """Get quiz response by session token"""
        model = self.db_session.query(QuizSessionModel).filter_by(
            session_token=session_token
        ).first()

        return self._to_entity(model) if model else None

    def _to_entity(self, model: QuizSessionModel) -> QuizResponse:
        """Convert database model to domain entity"""
        return QuizResponse(
            id=model.id,
            session_id=model.session_token,
            user_id=model.user_id,
            current_step=model.current_step,
            responses=model.responses,
            started_at=model.started_at,
            completed_at=model.completed_at,
            is_completed=model.is_completed
        )
```

### 8.4 Presentation Layer Example

**backend/src/presentation/api/v1/routes/quiz.py**
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .....application.use_cases.save_step_response import (
    SaveStepResponseUseCase,
    SaveStepResponseInput
)
from .....infrastructure.database.session import get_db_session
from .....infrastructure.database.repositories.quiz_repository import (
    SQLAlchemyQuizRepository
)
from ..schemas.quiz_schema import SaveStepRequestSchema, SaveStepResponseSchema

quiz_bp = Blueprint('quiz', __name__, url_prefix='/quiz')

@quiz_bp.route('/step', methods=['POST'])
@jwt_required()
def save_step():
    """Save quiz step response"""

    # Validate request
    schema = SaveStepRequestSchema()
    data = schema.load(request.get_json())

    # Get dependencies
    db_session = get_db_session()
    quiz_repository = SQLAlchemyQuizRepository(db_session)
    use_case = SaveStepResponseUseCase(quiz_repository)

    # Execute use case
    input_dto = SaveStepResponseInput(
        session_token=data['session_token'],
        step=data['step'],
        response=data['response']
    )

    output = use_case.execute(input_dto)

    # Return response
    response_schema = SaveStepResponseSchema()
    return jsonify(response_schema.dump(output)), 200
```

---

## 9. FRONTEND IMPLEMENTATION

### 9.1 Quiz State Management (Zustand)

**frontend/src/store/quizStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  sessionToken: string | null;
  currentStep: number;
  responses: Record<string, any>;
  isCompleted: boolean;

  // Actions
  startQuiz: (sessionToken: string) => void;
  saveStepResponse: (step: number, response: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      sessionToken: null,
      currentStep: 0,
      responses: {},
      isCompleted: false,

      startQuiz: (sessionToken) => set({ sessionToken, currentStep: 1 }),

      saveStepResponse: (step, response) => set((state) => ({
        responses: { ...state.responses, [`step_${step}`]: response }
      })),

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 16)
      })),

      previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),

      completeQuiz: () => set({ isCompleted: true }),

      resetQuiz: () => set({
        sessionToken: null,
        currentStep: 0,
        responses: {},
        isCompleted: false
      })
    }),
    {
      name: 'quiz-storage'
    }
  )
);
```

### 9.2 Quiz Step Component

**frontend/src/components/quiz/StepTypes/SingleSelectImage.tsx**
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { quizService } from '@/services/quizService';

interface Option {
  value: string;
  label: string;
  image: string;
}

interface SingleSelectImageProps {
  step: number;
  question: string;
  options: Option[];
  onNext: () => void;
}

export const SingleSelectImage: React.FC<SingleSelectImageProps> = ({
  step,
  question,
  options,
  onNext
}) => {
  const { sessionToken, saveStepResponse } = useQuizStore();

  const handleSelect = async (value: string) => {
    // Save to local state
    saveStepResponse(step, { answer: value });

    // Save to backend
    try {
      await quizService.saveStepResponse(sessionToken!, step, {
        answer: value
      });

      // Auto-advance
      setTimeout(onNext, 300);
    } catch (error) {
      console.error('Failed to save response:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-serif text-gold-600 text-center mb-8">
        {question}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(option.value)}
            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              src={option.image}
              alt={option.label}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white text-xl font-semibold">
                {option.label}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
```

### 9.3 Quiz Flow Component

**frontend/src/pages/QuizFlow.tsx**
```typescript
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/quizStore';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { SingleSelectImage } from '@/components/quiz/StepTypes/SingleSelectImage';
import { TransitionStatistic } from '@/components/quiz/StepTypes/TransitionStatistic';
// ... other step imports
import { quizConfig } from '@/config/quizConfig';

export const QuizFlow: React.FC = () => {
  const { currentStep, nextStep, previousStep, sessionToken } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) {
      navigate('/');
    }
  }, [sessionToken, navigate]);

  const renderStep = () => {
    const stepConfig = quizConfig.steps[currentStep];

    switch (stepConfig.type) {
      case 'single-select-image':
        return (
          <SingleSelectImage
            step={currentStep}
            question={stepConfig.question}
            options={stepConfig.options}
            onNext={nextStep}
          />
        );

      case 'transition-statistic':
        return (
          <TransitionStatistic
            step={currentStep}
            content={stepConfig.content}
            onNext={nextStep}
          />
        );

      // ... other step types

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {currentStep > 1 && <ProgressBar current={currentStep} total={16} />}

      <main className="container mx-auto py-12">
        {renderStep()}
      </main>

      {currentStep > 1 && currentStep < 16 && (
        <button
          onClick={previousStep}
          className="fixed bottom-8 left-8 text-gold-600 hover:text-gold-700"
        >
          ← Voltar
        </button>
      )}
    </div>
  );
};
```

---

## 10. IMPLEMENTATION PHASES

### Phase 1: Setup & Infrastructure (Days 1-2)
**Estimated: 8-10 hours**

- [ ] Create project structure
- [ ] Set up Docker Compose
- [ ] Configure PostgreSQL + Redis
- [ ] Backend: Flask app factory, config, database connection
- [ ] Backend: Set up Alembic migrations
- [ ] Frontend: Initialize Vite + React + TypeScript
- [ ] Frontend: Configure Tailwind CSS
- [ ] Create initial database schema
- [ ] Run first migration
- [ ] Test Docker containers communication

**Deliverable:** All services running in Docker, database ready

---

### Phase 2: Backend Core (Days 2-4)
**Estimated: 12-14 hours**

- [ ] Domain entities (User, QuizResponse, Diagnosis)
- [ ] Domain services (DiagnosisService, TriangleCalculator)
- [ ] Application use cases (StartQuiz, SaveStep, GenerateDiagnosis)
- [ ] Repository interfaces and implementations
- [ ] Database models (SQLAlchemy)
- [ ] Authentication (JWT)
- [ ] API routes (auth, quiz, diagnosis)
- [ ] Request/response schemas (Marshmallow)
- [ ] Error handling middleware
- [ ] Unit tests for domain layer

**Deliverable:** Functional backend API with auth

---

### Phase 3: Frontend Foundation (Days 4-6)
**Estimated: 10-12 hours**

- [ ] React Router setup
- [ ] Zustand stores (auth, quiz, user)
- [ ] API service layer (Axios)
- [ ] Authentication flow (login, register)
- [ ] Protected routes
- [ ] Layout components (Header, Footer, Container)
- [ ] Common UI components (Button, Input, Card)
- [ ] Design system (Tailwind config, colors, fonts)
- [ ] Prelanding page

**Deliverable:** Auth flow working, design system ready

---

### Phase 4: Quiz Steps Implementation (Days 6-10)
**Estimated: 16-18 hours**

- [ ] ProgressBar component
- [ ] QuizStep wrapper component
- [ ] Step Type 1: SingleSelectImage
- [ ] Step Type 2: SingleSelectEmoji
- [ ] Step Type 3: SingleSelectText (binary)
- [ ] Step Type 4: MultiSelectCheckbox
- [ ] Step Type 5: EmojiScale
- [ ] Step Type 6: TransitionStatistic
- [ ] Step Type 7: TransitionAffirmation
- [ ] Step Type 8: LoadingScreen (5s animation)
- [ ] Step Type 9: EmailCapture
- [ ] Step Type 10: ResultPage (diagnosis display)
- [ ] Step Type 11: MicroVSL (video player)
- [ ] Step Type 12: Checkout
- [ ] Quiz navigation logic
- [ ] Dynamic content replacement

**Deliverable:** All 16 quiz steps functional

---

### Phase 5: Integrations (Days 10-12)
**Estimated: 8-10 hours**

- [ ] Email service integration (SendGrid/Mailgun)
- [ ] Celery tasks for async email sending
- [ ] Payment service integration (Kiwify)
- [ ] Webhook handling for payments
- [ ] Analytics integration (GA4, Facebook Pixel)
- [ ] Event tracking throughout quiz
- [ ] Email follow-up sequences (Celery scheduled tasks)

**Deliverable:** External services integrated

---

### Phase 6: User Dashboard (Days 12-13)
**Estimated: 6-8 hours**

- [ ] Dashboard layout
- [ ] User profile page
- [ ] Subscription management
- [ ] Calendar view (abundance calendar)
- [ ] Diagnosis history
- [ ] Settings page

**Deliverable:** User dashboard functional

---

### Phase 7: Testing & Polish (Days 13-15)
**Estimated: 10-12 hours**

- [ ] Backend unit tests (pytest)
- [ ] Backend integration tests (API endpoints)
- [ ] Frontend component tests (Vitest)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Cross-browser testing
- [ ] Mobile responsive adjustments
- [ ] Loading states
- [ ] Error handling
- [ ] Accessibility (WCAG AA)
- [ ] Performance optimization
- [ ] Code review and refactoring

**Deliverable:** Production-ready, tested application

---

### Phase 8: Deployment & Launch (Days 15-16)
**Estimated: 6-8 hours**

- [ ] Production Docker Compose setup
- [ ] Environment configuration
- [ ] Database backup strategy
- [ ] SSL certificates
- [ ] Domain configuration
- [ ] Deploy to production server
- [ ] Run production migrations
- [ ] Smoke tests on production
- [ ] Set up monitoring (Sentry, logs)
- [ ] Documentation updates

**Deliverable:** Live application

---

**TOTAL ESTIMATED TIME: 76-92 hours (10-12 working days)**

---

## 11. TESTING STRATEGY

### 11.1 Backend Tests

```python
# tests/unit/domain/test_diagnosis_service.py
import pytest
from src.domain.services.diagnosis_service import DiagnosisService
from src.domain.entities.quiz_response import QuizResponse

def test_generate_diagnosis_for_age_35_44():
    """Test diagnosis generation for age range 35-44"""
    service = DiagnosisService()

    quiz_response = QuizResponse(
        # ... mock data
        responses={
            'step_2': {'answer': '35-44'},
            'step_4': {'answer': 'dinheiro'},
            'step_8': ['dinheiro-some', 'projetos-nao-decolam'],
            'step_9': 4
        }
    )

    diagnosis = service.generate_diagnosis(quiz_response)

    assert '35 aos 44' in diagnosis['diagnosis_text']
    assert diagnosis['favorable_days'] >= 5
    assert diagnosis['blocked_area'] == 'dinheiro'
```

### 11.2 Frontend Tests

```typescript
// src/components/quiz/StepTypes/__tests__/SingleSelectImage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SingleSelectImage } from '../SingleSelectImage';

describe('SingleSelectImage', () => {
  it('renders options correctly', () => {
    const options = [
      { value: 'travada', label: 'Travada', image: '/img/travada.jpg' },
      { value: 'instavel', label: 'Instável', image: '/img/instavel.jpg' }
    ];

    render(
      <SingleSelectImage
        step={1}
        question="Test question"
        options={options}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByText('Test question')).toBeInTheDocument();
    expect(screen.getByText('Travada')).toBeInTheDocument();
    expect(screen.getByText('Instável')).toBeInTheDocument();
  });

  it('calls onNext when option selected', async () => {
    const onNext = jest.fn();
    // ... test implementation
  });
});
```

---

## 12. DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Payment gateway in production mode
- [ ] Email service in production mode
- [ ] Analytics tracking IDs updated

### Deployment
- [ ] Build production Docker images
- [ ] Push images to registry
- [ ] Deploy to production server
- [ ] Run database migrations
- [ ] Start all services
- [ ] Verify health checks

### Post-deployment
- [ ] Test complete user flow
- [ ] Verify payment processing
- [ ] Check email delivery
- [ ] Monitor error logs (first 24h)
- [ ] Set up automated backups
- [ ] Configure monitoring alerts

---

## 13. NEXT STEPS

**Immediate Actions:**

1. ✅ **Review this plan** - does it align with your vision?

2. **Gather assets:**
   - [ ] Images for quiz options (Steps 1-2)
   - [ ] Mestra Renata photos
   - [ ] VSL video (80 seconds)
   - [ ] Product mockups

3. **Set up accounts:**
   - [ ] Email service (SendGrid/Mailgun)
   - [ ] Payment gateway (Kiwify)
   - [ ] Analytics (GA4, Facebook Pixel)

4. **Make decisions:**
   - [ ] Domain name
   - [ ] Hosting provider (AWS/DigitalOcean/Railway)
   - [ ] Target launch date

5. **Start development:**
   - Begin with Phase 1 (Setup & Infrastructure)

---

**Ready to start building? Which phase should we begin with?** 🚀
