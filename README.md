# 🌱 ZeroWaste AI

> **Turn food waste into community impact — powered by AI.**

ZeroWaste AI is a full-stack web application that helps restaurants, cafes, and food businesses eliminate food waste through intelligent inventory tracking, AI-generated recipe suggestions, and seamless donation coordination with local food banks.

---

## ✨ Features

- 📦 **Smart Inventory Tracking** — Log food items and get real-time freshness scores and waste-risk labels
- 🤖 **AI Recipe Suggestions** — Gemini-powered recipe generation using ingredients about to expire
- 🏦 **Food Bank Matching** — Find nearby food banks that accept your surplus items
- 📊 **Impact Dashboard** — Track CO₂ saved, meals donated, and money recovered
- 🔔 **Expiry Alerts** — Proactive notifications before items hit their waste threshold
- 🔐 **Multi-tenant Auth** — Firebase Authentication with per-user data isolation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZeroWaste AI                             │
├───────────────────────────┬─────────────────────────────────────┤
│        FRONTEND           │             BACKEND                 │
│   React + TypeScript      │        FastAPI (Python)             │
│   Vite + Tailwind CSS     │        Google Cloud Run             │
│   Firebase Hosting        │                                     │
│                           │  ┌──────────────────────────────┐  │
│  ┌────────────────────┐   │  │      AI / ML Services        │  │
│  │  Pages             │   │  │  ┌────────────────────────┐  │  │
│  │  ├─ Dashboard      │◄──┼──┤  │  Gemini 1.5 Pro API    │  │  │
│  │  ├─ Inventory      │   │  │  │  (Recipe Generation)   │  │  │
│  │  ├─ AI Recipes     │   │  │  └────────────────────────┘  │  │
│  │  ├─ Donate         │   │  │  ┌────────────────────────┐  │  │
│  │  └─ Impact         │   │  │  │  Freshness Scoring     │  │  │
│  └────────────────────┘   │  │  │  (Rule-based + ML)     │  │  │
│                           │  │  └────────────────────────┘  │  │
│  ┌────────────────────┐   │  └──────────────────────────────┘  │
│  │  Firebase SDK      │   │                                     │
│  │  ├─ Auth           │   │  ┌──────────────────────────────┐  │
│  │  └─ Firestore      │   │  │       Data Layer             │  │
│  └────────────────────┘   │  │  ┌────────────────────────┐  │  │
│                           │  │  │  Cloud Firestore        │  │  │
└───────────────────────────┘  │  │  (Primary Database)     │  │  │
                               │  └────────────────────────┘  │  │
                               └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ZeroWaste AI/
├── frontend/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── services/           # API client + Firebase calls
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # Shared TypeScript types
│   │   └── utils/              # Helper functions
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # FastAPI Python service
│   ├── app/
│   │   ├── api/                # Route handlers
│   │   ├── services/           # Business logic (AI, scoring)
│   │   ├── models/             # Pydantic data models
│   │   └── core/               # Config, auth, Firebase admin
│   ├── requirements.txt
│   └── Dockerfile
│
├── data/                       # Reference data files
│   ├── food_shelf_life.json    # Shelf life by category/item
│   ├── co2_emission_factors.json
│   ├── sample_food_banks.json
│   └── sample_inventory.json
│
├── infrastructure/             # Firebase & Cloud config
│   ├── firebase.json
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── .firebaserc
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=zerowaste-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=zerowaste-ai
VITE_FIREBASE_STORAGE_BUCKET=zerowaste-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=zerowaste-ai
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173
```

> **⚠️ Warning:** Never commit `.env` files or service account JSON keys to version control.
> They are included in `.gitignore` by default.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x and **npm** ≥ 9.x
- **Python** ≥ 3.11
- **Firebase CLI** (`npm install -g firebase-tools`)
- A Firebase project with Firestore and Authentication enabled
- A Google AI (Gemini) API key

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and API credentials

# Start the development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at **http://localhost:8000**  
Interactive API docs at **http://localhost:8000/docs**

---

## 🧪 Running Tests

```bash
# Frontend unit tests
cd frontend
npm run test

# Frontend e2e tests (Playwright)
npm run test:e2e

# Backend tests
cd backend
pytest --cov=app tests/
```

---

## ☁️ Deployment

### Deploy Frontend to Firebase Hosting

```bash
# Build the production bundle
cd frontend
npm run build

# Authenticate with Firebase
firebase login

# Deploy hosting + Firestore rules + indexes
cd ../infrastructure
firebase deploy --project zerowaste-ai
```

### Deploy Backend to Google Cloud Run

```bash
cd backend

# Build and push the Docker image
gcloud builds submit --tag gcr.io/zerowaste-ai/api

# Deploy to Cloud Run
gcloud run deploy zerowaste-api \
  --image gcr.io/zerowaste-ai/api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production
```

### Deploy Firestore Rules & Indexes

```bash
cd infrastructure

# Deploy rules only
firebase deploy --only firestore:rules --project zerowaste-ai

# Deploy indexes only
firebase deploy --only firestore:indexes --project zerowaste-ai
```

---

## 📡 API Documentation

### Base URL
- **Development:** `http://localhost:8000`
- **Production:** `https://api.zerowaste-ai.run.app`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `POST` | `/api/v1/inventory` | Add a new food item |
| `GET` | `/api/v1/inventory` | List all items for the user |
| `PUT` | `/api/v1/inventory/{id}` | Update an existing item |
| `DELETE` | `/api/v1/inventory/{id}` | Remove an item |
| `POST` | `/api/v1/ai/recipes` | Generate AI recipes from ingredients |
| `GET` | `/api/v1/food-banks` | List nearby food banks |
| `POST` | `/api/v1/actions/donate` | Log a donation action |
| `GET` | `/api/v1/impact` | Get user impact statistics |
| `POST` | `/api/v1/freshness/score` | Score item freshness |

Full interactive documentation is available at `/docs` (Swagger UI) and `/redoc`.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Styling** | Tailwind CSS + shadcn/ui | Component library |
| **Routing** | React Router v6 | Client-side routing |
| **State** | Zustand | Global state management |
| **Charts** | Recharts | Impact data visualization |
| **Build** | Vite | Frontend bundler |
| **Backend** | FastAPI (Python) | REST API server |
| **AI / LLM** | Google Gemini 1.5 Pro | Recipe generation |
| **Auth** | Firebase Authentication | User management |
| **Database** | Cloud Firestore | NoSQL document store |
| **Hosting** | Firebase Hosting | Frontend CDN |
| **API Hosting** | Google Cloud Run | Serverless backend |
| **Containerization** | Docker | Backend packaging |
| **Testing** | Vitest + Playwright | Frontend tests |
| **Testing** | pytest + httpx | Backend tests |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🌍 Impact

Every kilogram of food saved from landfill:
- Prevents **~2–27 kg CO₂e** emissions (depending on food type)
- Provides up to **4 meals** when donated
- Recovers cost value for the business

> *Together, we can build a zero-waste future — one meal at a time.*
