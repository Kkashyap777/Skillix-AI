# Skillix AI - Personalized Learning Roadmap Navigator

Skillix AI is an enterprise-grade, full-stack web application designed to help students, self-learners, and professionals navigate the overwhelming world of information. Most learners get stuck wondering where to start; Skillix AI solves this by analyzing resumes, calculating ATS efficiency, and generating structured, step-by-step learning paths in seconds using AI.

** Live Demo:** [https://skillix-ai.vercel.app/](https://skillix-ai.vercel.app/)

##  Key Features

- **Resume-to-Roadmap Scan:** Deep parsing of PDF resumes to extract existing skill sets and identify skill gaps for specific target roles.
- **AI Roadmap Generation:** Leverages Google's Gemini AI to create detailed, hierarchical, and phase-based learning paths tailored to selected timelines (e.g., 4 Weeks to 12 Months).
- **Resource Curation:** Automated linking to free, relevant YouTube tutorials for every specific learning task.
- **Instant Access:** Includes a Guest Login feature for recruiters and guests to try the app instantly.
- **Secure Authentication:** Robust user accounts with mandated email verification (OTP) and secure password recovery.
- **PDF Export:** Allows users to download and save their personalized roadmaps for offline study.
- **Responsive UI:** Built with React, Vite, and Material UI for a polished, mobile-friendly experience with a Custom Industrial Modern Dark Theme.
- **Enterprise Security:** Advanced protection including rate limiting, payload validation (`express-validator`), and encrypted tokens.

##  Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│        React 18 + Vite + Material UI (Dark Theme)           │
├──────────────────────────────┬──────────────────────────────┤
│      User Authentication     │    Interactive Dashboard     │
│ (Login, Register, Guest, OTP)│ (Roadmaps, Progress Tracking)│
├──────────────────────────────┴──────────────────────────────┤
│                        REST API                             │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
│             Node.js + Express.js (Micro-Monolith)           │
├──────────────────────┬──────────────────────┬───────────────┤
│   Security & Auth    │  Analysis Engine     │ Roadmap Sync  │
│(Helmet, Rate-Limits) │ (PDF-Parse, Gemini)  │  (Mongoose)   │
├──────────────────────┴──────────────────────┴───────────────┤
│                      Data Layer                             │
│                     MongoDB Atlas                           │
└─────────────────────────────────────────────────────────────┘
```

##  The Tech Stack

**Frontend**
- **Framework:** React.js (Vite)
- **UI Library:** Material-UI (MUI), Framer Motion (Optional Animations), Lucide React
- **State & Fetching:** React Hooks + Axios
- **Export Utility:** html2pdf.js
- **Deployment:** Vercel

**Backend**
- **Runtime:** Node.js
- **API Framework:** Express.js
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Document Processing:** `multer` (Memory Storage), `pdf-parse`
- **Email Service:** Resend (`resend` SDK)
- **Deployment:** Render

**Security & Database**
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Authentication:** `jsonwebtoken`, `bcryptjs`, Node `crypto`
- **Protection:** `helmet`, `express-rate-limit`, `express-validator`, `express-mongo-sanitize`

##  Project Structure

```text
skillix-ai/
├── backend/                  # Secure Express server and APIs
│   ├── server.js             # Core server logic, security middlewares, and AI integration
│   ├── package.json
│   └── .env                  # Environment variables (Ignored in Git)
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── App.jsx           # Main UI, Auth Flows, Dashboard, and Generator
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore                # Root gitignore rules ensuring security
```

##  API Endpoints

**Authentication API**
- `POST /api/auth/register` - Register a new user & dispatch verification email
- `POST /api/auth/verify-email` - Validate 6-digit OTP code
- `POST /api/auth/resend-verification` - Dispatch new OTP code
- `POST /api/auth/login` - Authenticate verified user & issue JWT
- `POST /api/auth/guest-login` - Instant access via guest account
- `POST /api/auth/forgot-password` - Dispatch 6-digit recovery OTP
- `POST /api/auth/reset-password` - Reset password via verified OTP
- `GET /api/auth/profile` - Fetch current user profile

**Analysis & Roadmap API**
- `POST /api/analyze` - Upload PDF resume, trigger Gemini AI, generate roadmap
- `GET /api/roadmaps/me` - Fetch saved roadmaps for the logged-in user
- `PATCH /api/roadmaps/:id/tasks` - Sync task completion progress to the cloud


##  Developed By

This project was built as a collaborative effort to solve a real learning problem.

- **Krinjal Kashyap** ([@Kkashyap777](https://github.com/Kkashyap777))
- **Tonmoy Thakuria** ([@TonmoyThakuria018](https://github.com/TonmoyThakuria018))

## 📄 License
Proprietary - All Rights Reserved.
