<div align="center">
  <img src="public/window.svg" alt="HireFlow AI" width="80" height="80">
  <h1 align="center">HireFlow AI</h1>
  <p align="center">
    <strong>Explainable AI Recruiter Copilot</strong>
    <br />
    Hire Smarter. Faster. Fairer.
  </p>
</div>

---

## 🌟 Overview

**HireFlow AI** is a state-of-the-art Explainable AI Recruiter Copilot designed for modern hiring teams. It streamlines the recruitment process by leveraging the Gemini AI engine to perform semantic analysis on job descriptions and candidate resumes. 

Rather than relying on rigid keyword matching, HireFlow AI uncovers latent capabilities, identifies hidden talent, and provides an *Explainable Match Replay* that reveals exactly why candidates are ranked the way they are—ensuring data-driven, bias-free decisions.

## ✨ Key Features

- **Semantic Skill Extraction**: Extracts structured skills, experience blocks, and potential growth indicators from resumes and job descriptions using Gemini AI.
- **Explainable Match Replay™**: Transparent breakdown of candidate scoring (e.g., Core Fit, Hidden Talent offsets) so you never have to guess *why* an AI made a recommendation.
- **Hidden Talent Discovery**: Flags non-traditional applicants whose adaptive learning signals and transferable skills make them a high-potential hire despite missing exact keywords.
- **AI Interview Copilot**: Automatically generates targeted technical and behavioral interview questions tailored to fill gaps in a candidate's specific background.
- **Hiring Analytics Hub**: Real-time dashboards visualizing active scans, skill gap matrices, pipeline velocity, and compliance scores.

## 🛠️ Technology Stack

### Frontend
- **React 18** (via Vite)
- **TypeScript**
- **Framer Motion** (for fluid animations and micro-interactions)
- **Recharts** (for radar and area analytics visualizations)
- **Tailwind CSS** (for styling and modern dark-mode UI)
- **Zustand** (for lightweight global state management)

### Backend
- **FastAPI (Python 3.10+)**
- **PostgreSQL / SQLite** (via SQLAlchemy ORM)
- **Google Gemini API** (for LLM document parsing and semantic analysis)
- **Uvicorn** (ASGI server)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Google Gemini API Key

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy the example environment file and add your Gemini API Key.
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and set `GEMINI_API_KEY=your_api_key_here`.*

5. **Start the FastAPI server:**
   ```bash
   python -m uvicorn app.main:app --reload
   # Or run the startup script: python app/main.py
   ```
   *The API will be available at `http://localhost:8000`*

### Frontend Setup

1. **Navigate to the root directory:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`*

## 📁 Project Structure

```text
HireFlowAI/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── core/             # Config, security, file parsers
│   │   ├── database/         # SQLAlchemy session & base
│   │   ├── models/           # DB Models (Job, Candidate, etc.)
│   │   ├── routers/          # API Endpoints
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Gemini AI & Ranking business logic
│   └── main.py               # Application entrypoint
├── src/                      # React Frontend Application
│   ├── api/                  # Axios API client setup
│   ├── components/           # Reusable UI components & visualizers
│   ├── pages/                # Main views (Landing, Dashboard, Intelligence)
│   ├── store/                # Zustand global state
│   └── App.tsx               # Main routing
└── ...
```

## 🔒 License

© 2026 HireFlow AI. All rights reserved.
