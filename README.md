# Skillix AI - Personalized Learning Roadmap Navigator

Skillix AI is an enterprise-grade, full-stack web application designed to help students, self-learners, and professionals navigate the overwhelming world of information. Most learners get stuck wondering where to start; Skillix AI solves this by analyzing resumes, calculating ATS efficiency, and generating structured, step-by-step learning paths in seconds using AI.

**🌐 Live Demo:** [https://skillix-ai.vercel.app/](https://skillix-ai.vercel.app/)

## 🎯 Key Features

- **Resume-to-Roadmap Scan:** Deep parsing of PDF resumes to extract existing skill sets and identify skill gaps for specific target roles.
- **AI Roadmap Generation:** Leverages Google's Gemini AI to create detailed, hierarchical, and phase-based learning paths tailored to selected timelines (e.g., 4 Weeks to 12 Months).
- **Resource Curation:** Automated linking to free, relevant YouTube tutorials for every specific learning task.
- **Instant Access:** Includes a Guest Login feature for recruiters and guests to try the app instantly.
- **Secure Authentication:** Robust user accounts with mandated email verification (OTP) and secure password recovery.
- **PDF Export:** Allows users to download and save their personalized roadmaps for offline study.
- **Responsive UI:** Built with React, Vite, and Material UI for a polished, mobile-friendly experience with a Custom Industrial Modern Dark Theme.
- **Enterprise Security:** Advanced protection including rate limiting, payload validation (`express-validator`), and encrypted tokens.

## 🏗️ Architecture

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

## 🚀 The Tech Stack

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

## 🚦 API Endpoints

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

## 🔄 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key
- Resend API Key

### Quick Start

1. **Clone repository**
```bash
git clone https://github.com/Kkashyap777/Skillix-AI.git
cd skillix-ai
```

2. **Backend Setup**
```bash
cd backend
npm install
```
*Create a `.env` file in the `backend` directory:*
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_highly_secure_random_string
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```
*Create a `.env` file in the `frontend` directory:*
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the Application**
*(Open two terminal windows)*

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Access the application at:** `http://localhost:5173`

***

## 👨‍💻 Developed By

This project was built as a collaborative effort to solve a real learning problem.

- **Krinjal Kashyap** ([@Kkashyap777](https://github.com/Kkashyap777))
- **Tonmoy Thakuria** ([@TonmoyThakuria018](https://github.com/TonmoyThakuria018))

## 🤝 Contributing
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request.

## 📄 License
Proprietary - All Rights Reserved.
