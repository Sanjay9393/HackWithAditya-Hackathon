# PrajaAI — Smart Village AI Platform
> *"Your village. Your information. Your future."*
> *"మీ గ్రామం. మీ సమాచారం. మీ భవిష్యత్తు."*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-TailwindCSS_3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini_2.0-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet_OpenStreetMap-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)

---

## 1. Product Vision & Overview

**PrajaAI** is an AI-powered, multilingual digital village operating platform engineered for rural and semi-urban Indian communities. It connects citizens, farmers, students, and village administrators with real-time civil works tracking, verified government welfare schemes, civic problem reporting, Gram Sabha intelligence, and agricultural advisory services in **Telugu (తెలుగు)** and **English**.

PrajaAI is designed not merely as a conversational chatbot, but as an **integrated digital civic technology platform** inspired by modern civic systems, Linear, and Notion.

---

## 2. Engineering Team & Hackathon Contributors

| Team Member | Role & Module | GitHub Profile |
| :--- | :--- | :--- |
| **Sanjay** | Frontend Lead, App Shell, Branding & Analytics Dashboard | [@sanjay9393](https://github.com/sanjay9393) |
| **Jyothi** | Schemes Discovery & Rule Engine Evaluator | [@Jyothi006](https://github.com/Jyothi006) |
| **Sadvika Pabolu** | Civic Grievances, Duplicate Redressal & Leaflet GIS Map | [@SadvikaPabolu](https://github.com/SadvikaPabolu) |
| **Bharath Kishor** | Multilingual AI Assistant, Gemini RAG & Document Intelligence | [@bharathkishor864](https://github.com/bharathkishor864) |
| **Srikanth** | Backend Lead, Database Architecture, Models & Security | [@SRIKANTH-06-02](https://github.com/SRIKANTH-06-02) |
| **Ravi Prakash Badugu** | Farmer Center, APMC Market Rates & MGNREGA Employment | [@raviprakashbadugu](https://github.com/raviprakashbadugu) |

---

## 3. Key Modules & Features

| Module | Feature Capabilities |
| :--- | :--- |
| **Smart Village Dashboard** | Real-time village KPIs (works, issues, ₹149L budget, notices), Recharts analytics, weather forecast, quick actions |
| **Village Works Tracker** | 12 civil projects with ward filter, category filter, budget vs actual expenditure, contractor records, before/after photos |
| **Budget Transparency** | Audited sector-wise breakdown (Roads, Water, Health, Education), Recharts comparisons, and factual AI budget insights |
| **Interactive Village Map** | OpenStreetMap GIS layers for civil projects, public facilities (PHC, School, RBK, Sachivalayam), and geo-tagged complaints |
| **Scheme Discovery Engine** | 15 verified Central and Andhra Pradesh state schemes (PM-Kisan, Rythu Bharosa, Amma Vodi, Aarogyasri, PMAY-G) |
| **Personalized Scheme Finder** | Structured rule engine assessing citizen profile (occupation, land holding, income ceiling, age) with transparency |
| **Document Readiness Checklist**| Interactive checklist tracking Aadhaar, Pattadar passbook, Rice card with completion percentage bar |
| **Scheme Comparison Matrix** | Side-by-side comparison of up to 4 schemes across criteria, benefits, and required paperwork |
| **Civic Issue Reporting** | Grievance redressal with photo upload, ward selection, and automated AI routing to responsible departments |
| **AI Duplicate Issue Detection**| Real-time spatial and text similarity algorithm warning citizens of identical nearby complaints |
| **Village Announcements** | Emergency alerts, summer water supply schedules, power outage notices, and pulse polio camps |
| **Gram Sabha Intelligence** | Meeting agendas, approved citizen resolutions, and plain-language summaries in English and Telugu |
| **Farmer Intelligence Center** | Seasonal crop advisories (Paddy, Red Chili, Cotton), pest alerts, and daily Guntur APMC Market Yard prices |
| **Services Directory** | Searchable contact guide for Sachivalayam, PHC, Cooperative Bank, Ration Shop, Anganwadi, and Police Beat |
| **Local Employment & MGNREGA** | Statutory daily wage rate (₹300/day), 100-day guarantee guidance, job card steps, and active work demand links |
| **Conversational AI Assistant** | Multilingual assistant with RAG grounding over village documents, source citations, and Web Speech voice STT/TTS |
| **Document Intelligence** | OCR and PDF parser extracting key dates, plain-language summaries, and action items from uploaded notices |
| **Administrative Console** | Role-based dashboard allowing Panchayat Secretaries to log progress milestones, resolve complaints, and publish notices |

---

## 3. Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom Indian civic color palette (`#166534` Forest Green, `#DCFCE7` Mint Light)
- **Icons**: Lucide React
- **Typography**: Inter and Noto Sans Telugu (Google Fonts)
- **Charts**: Recharts (BarChart, PieChart, LineChart)
- **Maps**: Leaflet with OpenStreetMap
- **HTTP Client**: Axios with JWT interceptors
- **Voice**: Web Speech API (SpeechRecognition & SpeechSynthesis)

### Backend
- **Framework**: Python FastAPI
- **Data Validation**: Pydantic v2
- **ORM**: SQLAlchemy with SQLite (local development) / PostgreSQL ready
- **Security**: JWT Authentication with bcrypt password hashing & RBAC
- **AI & RAG Engine**: Official `google-genai` SDK + high-performance in-memory BM25/TF-IDF similarity search over village entities
- **Document Processing**: PyPDF text extraction
- **Testing**: Pytest test suite covering endpoints, rule evaluator, and duplicate detector

---

## 4. Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+ or v22+)
- Python (v3.10+ or v3.11+)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PrajaAi.git
cd PrajaAi
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The database initializes automatically and seeds realistic demo data for **Chandanagar Gram Panchayat** on first launch.*

### 3. Frontend Setup
```bash
# Open a new terminal in the frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```

Open **`http://localhost:5173`** (or `http://127.0.0.1:5173`) in your web browser.

---

## 5. 1-Click Demo Accounts (Judges & Evaluators)

PrajaAI includes **1-Click Demo Account Switchers** in the login screen and top header so judges can evaluate both citizen and administrative perspectives without typing:

| Role | Username | Password | Persona & Privileges |
| :--- | :--- | :--- | :--- |
| **Demo Citizen** | `citizen` | `citizen123` | **K. Sambaiah** — Farmer, Ward 3. Can report complaints, track scheme eligibility, save document checklists. |
| **Demo Admin** | `admin` | `admin123` | **B. Rajasekhar** — Panchayat Secretary. Full privileges to update works progress, resolve complaints, and post notices. |

---

## 6. 3-Minute Hackathon Demo Script

For evaluators and judges reviewing PrajaAI:

1. **Step 1: Smart Village Dashboard**
   - Open `http://localhost:5173`.
   - View village overview (Chandanagar Gram Panchayat, Guntur Dist), 4 KPI cards, Recharts works breakdown, and active alerts.
   - Toggle language to **తెలుగు (Telugu)** in the top header and observe immediate translation.

2. **Step 2: Village Works Tracker**
   - Click **Village Works** in the sidebar.
   - Filter by **Category** (Roads, Drinking Water) or **Ward 2**.
   - Click on *"Cement Concrete (CC) Road Construction"*.
   - Review the financial audit (₹14.5L sanctioned, ₹11.2L spent), milestone timeline, and before/progress/after photo gallery.

3. **Step 3: AI Village Assistant with Citations**
   - Click **AI Village Assistant** in the sidebar.
   - Click on the suggested prompt: *"What development works are happening in my village?"* (or speak via the microphone).
   - The assistant answers strictly grounded in verified database records, providing clickable source cards.

4. **Step 4: Personalized Scheme Recommendation Engine**
   - Click **Scheme Finder (AI)**.
   - Modify citizen profile (e.g., Occupation: Farmer, Land: 3.5 Acres, Income: ₹1,20,000).
   - Observe real-time rule engine scoring (PM-Kisan & Rythu Bharosa score 95%+).
   - Click **Checklist & Apply** to track required document readiness.

5. **Step 5: Civic Complaint Reporting & AI Duplicate Detection**
   - Click **Civic Issues** -> **Report a Village Issue**.
   - Enter *"Severe drinking water pipe leak"* in Ward 3.
   - Observe the **AI Duplicate Detection banner** warning: *"Found similar water complaints reported within 300 meters"*.
   - Submit the complaint.

6. **Step 6: Admin Workflow**
   - Click the user profile in the top-right and switch to **Demo Admin (Panchayat Secretary)**.
   - Go to **Civic Issues**, select the newly reported complaint, and mark it as **"In progress"** or **"Resolved"**.
   - Switch back to **Citizen Mode** and view the instant resolution update in the notification center.

---

## 7. Responsible AI & Data Transparency

1. **Strict Non-Hallucination Grounding**: The conversational assistant only synthesizes answers from verified village records. If an inquiry falls outside stored knowledge, it explicitly reports: *"Information not verified or unavailable in village records."*
2. **Explicit Sample Data Labeling**: All synthetic demonstration records are labeled as `"DEMO DATA — Not official government information"`.
3. **No Financial Allegations**: The AI budget analytics engine strictly computes ratios and variance without making unfounded legal allegations against contractors or officers.
4. **Offline / Demo Mode**: The platform functions 100% locally using built-in grounded knowledge even without an external API key. When a `GEMINI_API_KEY` is provided, it seamlessly leverages Gemini 2.0.

---

## 8. Deployment Configuration

### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend (Render / Railway)
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: `DATABASE_URL`, `SECRET_KEY`, `GEMINI_API_KEY`

---

## 9. License & Credits

Developed with ❤️ for the Hackathon by the **PrajaAI Team**.  
*Empowering India's villages with transparency, dignity, and digital access.*
