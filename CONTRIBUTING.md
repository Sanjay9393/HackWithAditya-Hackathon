# Team Collaboration & Git Guide — PrajaAI (6-Member Team)

This guide documents the monorepo Git workflow, module division, and development standards for the 6-member PrajaAI engineering team.

---

## 1. Team Role & Module Division

| Member | GitHub Handle | Primary Responsibilities | Main Directories & Files |
| :--- | :--- | :--- | :--- |
| **Sanjay** | [@sanjay9393](https://github.com/sanjay9393) | Frontend Lead, app shell, navigation, village emblem logo, welcome screen, and analytics dashboard. | `frontend/src/components/layout/`, `frontend/src/components/common/`, `frontend/src/pages/DashboardPage.tsx` |
| **Jyothi** | [@Jyothi006](https://github.com/Jyothi006) | Scheme discovery catalog, eligibility evaluation engine, document readiness checklist, comparison matrix. | `frontend/src/pages/Schemes*.tsx`, `backend/app/api/schemes.py`, `backend/app/services/rule_engine.py` |
| **Sadvika Pabolu** | [@SadvikaPabolu](https://github.com/SadvikaPabolu) | Civic issue reporting, duplicate detection algorithm, Leaflet GIS village map, announcements, and Gram Sabha. | `frontend/src/pages/CivicIssuesPage.tsx`, `frontend/src/pages/MapPage.tsx`, `frontend/src/pages/AnnouncementsPage.tsx`, `frontend/src/pages/GramSabhaPage.tsx`, `backend/app/api/issues.py` |
| **Bharath Kishor** | [@bharathkishor864](https://github.com/bharathkishor864) | Multilingual RAG assistant, Google Gemini integration, voice STT/TTS audio hooks, and document OCR intelligence. | `backend/app/ai/`, `backend/app/api/ai.py`, `frontend/src/pages/AIAssistantPage.tsx`, `frontend/src/pages/DocumentIntelligencePage.tsx` |
| **Srikanth** | [@SRIKANTH-06-02](https://github.com/SRIKANTH-06-02) | Backend Lead, core FastAPI routing, database schema migrations, JWT security, auth endpoints, village works & budget APIs. | `backend/app/models/`, `backend/app/database/`, `backend/app/auth/`, `backend/app/api/projects.py`, `backend/app/api/budgets.py` |
| **Ravi Prakash Badugu** | [@raviprakashbadugu](https://github.com/raviprakashbadugu) | Farmer Intelligence, APMC market prices, MGNREGA employment, services directory, and automated test suite. | `frontend/src/pages/FarmersPage.tsx`, `frontend/src/pages/EmploymentPage.tsx`, `frontend/src/pages/ServicesPage.tsx`, `backend/app/api/agriculture.py`, `backend/app/api/employment.py` |

---

## 2. Git Branching Strategy

```
main (Protected — Always working, verified for demo)
 └── dev (Integration branch — tested before merging to main)
      ├── feature/schemes-eligibility (Member 2)
      ├── feature/civic-issues-map    (Member 3)
      ├── feature/budget-analytics    (Member 4)
      ├── feature/ai-rag-voice        (Member 5)
      └── feature/farmer-market-rates (Member 6)
```

### Golden Rules:
1. **Never push directly to `main`:** All code enters `main` via tested Pull Requests (PRs).
2. **Never commit sensitive files:** The `.gitignore` file automatically excludes `.env`, `node_modules/`, `dist/`, `.venv/`, and `*.db`.
3. **Pull before starting:** Always pull the latest changes from `main` or `dev` before creating a new feature branch.

---

## 3. Daily Developer Workflow (Commands)

### Step 1: Update your local workspace
```bash
git checkout main
git pull origin main
```

### Step 2: Create a feature branch
Use clear, descriptive branch names:
```bash
# Format: feature/<your-topic> or fix/<bug-topic>
git checkout -b feature/village-works-filter
```

### Step 3: Make changes & test locally
Before committing, make sure:
- Backend starts without error: `python -m uvicorn app.main:app`
- Frontend builds with zero TypeScript errors: `npm --prefix frontend run build`

### Step 4: Stage & commit with Conventional Commits
```bash
git add .
git commit -m "feat(works): add department and ward filter to village works tracker"
```

#### Commit Message Format:
- `feat:` for new capabilities (`feat(ai): integrate voice input hook`)
- `fix:` for bug fixes (`fix(proxy): update vite proxy target to 127.0.0.1`)
- `docs:` for documentation updates (`docs: update judge presentation guide`)
- `style:` for CSS / formatting changes
- `refactor:` for code cleanup without changing functionality

### Step 5: Push your branch to GitHub
```bash
git push -u origin feature/village-works-filter
```

### Step 6: Create a Pull Request (PR)
- Open GitHub / GitLab.
- Open a Pull Request from `feature/village-works-filter` into `main` (or `dev`).
- Have at least 1 other team member review and approve.
- Merge using **"Squash and merge"** or **"Rebase and merge"** to keep the history clean.

---

## 4. Setup Instructions for Team Members

When any team member clones this repository for the first time:

### 1. Clone the repository
```bash
git clone <YOUR-GITHUB-REPO-URL>
cd PrajaAi
```

### 2. Configure Environment Files
```bash
# Root environment
copy .env.example .env

# Backend environment
copy backend\.env.example backend\.env
```

### 3. Setup Backend (Python)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4. Setup Frontend (Node.js)
```bash
cd frontend
npm install
cd ..
```

### 5. Launch Application
Double-click `start.bat` or run:
```powershell
.\start.ps1
```
The database will automatically seed with 12 civil projects, 20 civic issues, and 15 welfare schemes on first run.

---

## 5. Resolving Merge Conflicts

If another teammate modified the same file:

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Rebase or merge main into your branch
git merge origin/main

# 3. Open VS Code — conflicting lines are marked with <<<<<<< and >>>>>>>
# Select "Accept Current Change", "Accept Incoming Change", or combine both.

# 4. Once resolved:
git add <resolved-file>
git commit -m "chore: resolve merge conflicts with main"
git push
```
