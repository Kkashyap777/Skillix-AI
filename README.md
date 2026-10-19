# Skillix AI — AI-Powered Career Development Platform

Skillix AI is a full-stack, AI-powered web application that helps students and aspiring professionals analyze their resumes, identify potential skill gaps, and generate personalized learning roadmaps.

The platform uses Google's Gemini API to turn resume information and learning goals into structured learning plans. Users can explore recommended learning resources, follow a learning path, and track their progress through a web browser.

**Live Demo:** [Explore Skillix AI](https://skillix-ai.vercel.app/)

> **Note for Interviewers and Demo Users:** Skillix AI currently supports access through the **Continue as Guest** option. New-user registration and email verification are not currently available in the public demo because production email verification has not yet been configured. Therefore, please select **Continue as Guest** to explore the application's available features without registering or verifying an email address. This guest access is provided so interviewers, recruiters, and other visitors can try the application and evaluate its functionality. Registration and email verification may be enabled in a future update.

---

## Features

### 1. Resume Analysis
- Upload PDF resumes for analysis.
- Extract relevant skills and qualifications from resume content.
- Identify potential skill gaps based on a user's target role.
- Use resume insights to guide personalized learning recommendations.

### 2. ATS-Related Resume Analysis
- Analyze resume content against supported resume evaluation criteria.
- Identify potential formatting and content improvements.
- Help users understand areas where their resumes may need improvement.

*Note: ATS compatibility depends on the screening system and the requirements of a particular job. Any analysis provided by Skillix AI should be treated as guidance, not a guarantee of passing an applicant tracking system.*

### 3. AI-Powered Learning Roadmaps
- Generate personalized learning roadmaps using Google's Gemini API.
- Organize topics into structured phases and individual learning tasks.
- Support different learning timelines, from 4 weeks to 12 months.
- Break complex subjects into manageable steps.

### 4. Learning Resource Recommendations
- Provide relevant YouTube learning resources for roadmap tasks.
- Help users find tutorials related to the topics they want to learn.
- Connect learning recommendations with individual roadmap stages.

### 5. Progress Tracking
- Save generated roadmaps for authenticated users.
- Track completed learning tasks.
- Synchronize task progress with the backend.

### 6. Authentication and Account Management
- Register accounts and verify email addresses using OTP.
- Authenticate users through the login system.
- Support password recovery and password-reset verification.
- Provide guest login for visitors who want to explore supported features.

### 7. PDF Export
- Export generated learning roadmaps as PDF documents.
- Keep a copy of a learning plan for offline reference.

### 8. Browser-Based Web Interface
- Built with React, Vite, and Material UI.
- Dark-themed interface with interactive components.
- Animations using Framer Motion.
- Responsive layouts for different screen sizes.
- Accessible through a web browser without requiring a separate native mobile or desktop application.

---

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite |
| UI Framework | Material UI |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| AI Integration | Google Gemini API (`@google/genai`) |
| Resume Processing | Multer, PDF parsing |
| Authentication | JSON Web Tokens, bcryptjs, Node.js crypto |
| Email Service | Resend |
| Security | Helmet, express-rate-limit, express-validator, express-mongo-sanitize |
| PDF Export | html2pdf.js |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## How It Works

1. The user accesses Skillix AI through a web browser.
2. The user uploads a PDF resume and provides the information required for the analysis.
3. The backend processes the request and extracts relevant resume information.
4. The application uses the Google Gemini API to generate AI-powered analysis and learning recommendations.
5. The generated roadmap is presented as structured learning phases and tasks.
6. Relevant learning resources help users explore individual topics.
7. Authenticated users can save their roadmaps and track task completion.

The exact workflow depends on the information provided by the user and the features enabled in the application.

---

## System Architecture

```text
                   USER
                    |
                    v
          Web Browser Interface
             React + Vite
                    |
                    v
                REST API
                    |
                    v
           Node.js + Express
                    |
          +---------+----------+
          |         |          |
          v         v          v
     Authentication Resume    Roadmap
       and OTP     Analysis   Management
          |         |          |
          |         v          |
          |    Google Gemini   |
          |         API        |
          |                    |
          +---------+----------+
                    |
                    v
               MongoDB Atlas
```

The frontend handles user interaction, while the backend manages application logic, authentication, data operations, and communication with the AI service.

---

## Project Structure

```text
Skillix-AI/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env                 # Local environment variables; not committed
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## API Endpoints

The following endpoints describe the application's authentication, resume analysis, and roadmap management APIs.

### Authentication API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user and initiate email verification |
| POST | `/api/auth/verify-email` | Verify an email using an OTP |
| POST | `/api/auth/resend-verification` | Request another verification OTP |
| POST | `/api/auth/login` | Authenticate a verified user |
| POST | `/api/auth/guest-login` | Access supported features through guest login |
| POST | `/api/auth/forgot-password` | Initiate password recovery |
| POST | `/api/auth/reset-password` | Reset a password using a recovery OTP |
| GET | `/api/auth/profile` | Retrieve the current user's profile |

### Resume Analysis and Roadmap API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Process a resume and generate a learning roadmap |
| GET | `/api/roadmaps/me` | Retrieve saved roadmaps for the authenticated user |
| PATCH | `/api/roadmaps/:id/tasks` | Update learning-task completion progress |

---

## Contributors

Skillix AI was developed collaboratively.

- **Krinjal Kashyap** — [GitHub Profile](https://github.com/Kkashyap777)
- **Tonmoy Thakuria** — [GitHub Profile](https://github.com/TonmoyThakuria018)

---

## Project Information

- **Project Name:** Skillix AI
- **Project Type:** Full-Stack Web Application
- **Domain:** Artificial Intelligence and Career Development
- **Frontend:** React.js and Vite
- **Backend:** Node.js and Express.js
- **Database:** MongoDB Atlas
- **AI Integration:** Google Gemini API
- **Deployment:** Vercel and Render

---

## Future Improvements

Potential improvements include:

- Resume matching against specific job descriptions.
- More detailed resume evaluation and feedback.
- Additional career-oriented learning recommendations.
- Improved learning progress analytics.
- Integration with additional learning resources.

These are potential future enhancements, not claims about existing functionality.

---

## License

**Proprietary — All Rights Reserved.**

This repository is not offered under an open-source license. Permission from the relevant rights holder is required to use, modify, or redistribute the code.
