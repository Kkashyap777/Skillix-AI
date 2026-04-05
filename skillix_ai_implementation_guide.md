# Skillix AI - Development Guide

Welcome! This guide is written for a team of 3 developers building a professional, AI-powered web app for career roadmap generation. It outlines the specific steps, code snippets, Git workflow, and deployment plan needed.

---

## 1. Team Collaboration & Git Workflow

Managing code with 3 developers requires a strict Git strategy to prevent merge conflicts and ensure maintainability. Do NOT push directly to `main`!

### General Rules
- The **`main`** branch holds the production-ready code.
- Create feature branches: `git checkout -b feature/frontend-setup` or `feature/backend-api` or `bugfix/fix-pdf-upload`.
- When a feature is complete, commit with descriptive messages: `git commit -m "feat: setup backend node express with multer"`.
- Push your branch: `git push origin feature/backend-api`.
- Open a **Pull Request (PR)** on GitHub. At least one teammate must review and approve before merging.

---

## 2. Folder Setup & Initialization

First, let's create our root folder structure:
```bash
mkdir Skillix_AI
cd Skillix_AI
mkdir frontend backend
```

---

## 3. Backend Implementation (Node.js/Express)

This backend runs on Express, handles file uploads (resumes) via Multer, extracts text using \`pdf-parse\`, and calls the Gemini API to analyze the gap and construct a roadmap.

### Installation Commands
```bash
cd backend
npm init -y
npm install express cors multer dotenv pdf-parse @google/genai
npm install nodemon --save-dev
```

### Backend Code

**`backend/package.json`**
*Update the scripts and add `"type": "module"`:*
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "@google/genai": "^0.1.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

**`backend/.env`**
```text
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

**`backend/server.js`**
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up file uploads to memory
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini 
// Make sure to securely store your API key in .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PORT = process.env.PORT || 5000;

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!req.file || !role) {
            return res.status(400).json({ error: 'Please submit both a resume (PDF) and a target role.' });
        }

        // 1. Extract text from PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        // 2. Build AI Prompt
        const prompt = `
        You are an expert career counselor. 
        Analyze the following resume text against the target role: "${role}".
        
        Please provide the response in EXACTLY this JSON format (do not use markdown formatting like \`\`\`json):
        {
          "identifiedSkills": ["skill 1", "skill 2"],
          "missingSkills": ["skill 3", "skill 4"],
          "roadmap": [
             { "week": 1, "focus": "Basics of missing skills", "tasks": ["Task A", "Task B"] },
             { "week": 2, "focus": "Intermediate concepts", "tasks": ["Task C", "Task D"] },
             { "week": 3, "focus": "Projects", "tasks": ["Task E", "Task F"] },
             { "week": 4, "focus": "Interview prep", "tasks": ["Task G", "Task H"] }
          ]
        }
        
        Resume:
        ${resumeText.substring(0, 5000)} // Limiting size for API
        `;

        // 3. Call Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text;
        
        // Ensure AI passes clean JSON. We strip backticks if generated
        const cleanJson = textResponse.replace(/^```json/g, '').replace(/```$/g, '').trim();

        const result = JSON.parse(cleanJson);
        res.json(result);

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze resume. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## 4. Frontend Implementation (React / Vite)

A clean, modern React app that allows users to pick their role, drop their PDF, and view beautifully structured results.

### Installation Commands
```bash
cd ../frontend
npx create-vite@latest . --template react
npm install
npm install axios react-hot-toast lucide-react
```

### Frontend Code

**`frontend/src/App.css`**
```css
/* Clean, modern styling using standard CSS variables */
:root {
  --bg-color: #f8fafc;
  --text-color: #1e293b;
  --card-bg: #ffffff;
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --success: #10b981;
  --danger: #ef4444;
  --border-color: #e2e8f0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 { font-size: 2.5rem; color: var(--primary-color); margin-bottom: 0.5rem; }
p.subtitle { color: #64748b; font-size: 1.1rem; }

/* Form Styles */
.upload-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 2rem;
}

.form-group { margin-bottom: 1.5rem; }
label { display: block; font-weight: 600; margin-bottom: 0.5rem; }

select, input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
}

button.submit-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

button.submit-btn:hover { background: var(--primary-hover); }
button.submit-btn:disabled { background: #94a3b8; cursor: not-allowed; }

/* Results Styles */
.results-container {
  display: grid;
  gap: 2rem;
}

.result-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
}

.skills-lists { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.skill-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  margin: 0.25rem;
}

.badge-present { background: #d1fae5; color: #065f46; }
.badge-missing { background: #fee2e2; color: #991b1b; }

.roadmap-week {
  border-left: 3px solid var(--primary-color);
  padding-left: 1rem;
  margin-bottom: 1.5rem;
}

.week-title { font-weight: bold; font-size: 1.2rem; color: var(--primary-color); }
```

**`frontend/src/App.jsx`**
```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const roles = [
    "Software Developer", "Data Scientist", "Product Manager", 
    "UX/UI Designer", "Frontend Developer", "Backend Developer"
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) return toast.error("Please provide both a resume and a role");

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      // In production, use your deployed backend URL.
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(response.data);
      toast.success("Analysis Complete!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Toaster position="top-right" />
      <header>
        <h1>Skillix AI</h1>
        <p className="subtitle">Discover your career gaps and get a custom 4-week roadmap.</p>
      </header>

      {!analysis ? (
        <form onSubmit={handleSubmit} className="upload-card">
          <div className="form-group">
            <label>Select Target Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="">-- Select a Role --</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Analyzing Skills..." : "Generate Roadmap"}
          </button>
        </form>
      ) : (
        <div className="results-container">
          <button className="submit-btn" style={{background: '#64748b'}} onClick={() => setAnalysis(null)}>
            Start Over
          </button>
          
          <div className="skills-lists">
            <div className="result-card">
              <h3>✅ Identified Skills</h3>
              <div>
                {analysis.identifiedSkills.map((s, i) => (
                  <span key={i} className="skill-badge badge-present">{s}</span>
                ))}
              </div>
            </div>

            <div className="result-card">
              <h3>❌ Missing Skills</h3>
              <div>
                {analysis.missingSkills.map((s, i) => (
                  <span key={i} className="skill-badge badge-missing">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="result-card">
            <h2>🗺️ 4-Week Learning Roadmap</h2>
            <div className="roadmap">
              {analysis.roadmap.map((weekData) => (
                <div key={weekData.week} className="roadmap-week">
                  <div className="week-title">Week {weekData.week}: {weekData.focus}</div>
                  <ul>
                    {weekData.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
```

---

## 5. Integration Notes

**Connecting them locally:**
1. Open a terminal in `backend/` and run `npm run dev` (starts on localhost:5000). Ensure your `.env` has a GEMINI API key.
2. Open another terminal in `frontend/` and run `npm run dev` (starts usually on localhost:5173).
3. Ensure the Frontend Axios tries to reach `http://localhost:5000/api`. This has been handled dynamically above via `.env` variables! 

---

## 6. Deployment Instructions

Since the team requires zero-cost options, **Vercel** (Frontend) and **Render** (Backend) are ideal choices.

### Backend (Render.com)
1. Commit and push the backend folder to GitHub.
2. Log into Render -> New -> **Web Service**.
3. Point to your repository. 
4. **Root Directory:** Make sure to set this as `backend`.
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. In the Render environment settings, add your `GEMINI_API_KEY`!
8. Once deployed, Render gives you a URL (e.g., `https://skillix-backend.onrender.com`).

### Frontend (Vercel.com)
1. Ensure the frontend folder is pushed to GitHub.
2. Log into Vercel -> **Add New Project**.
3. Import your repo.
4. **Framework Preset:** Select **Vite**.
5. **Root Directory:** Set this to `frontend`.
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://skillix-backend.onrender.com/api` (Use the Render URL you just got).
7. Hit Deploy! 

Your awesome student project is completely ready. Good luck to your team!
