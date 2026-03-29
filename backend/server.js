import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
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
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const resumeText = pdfData.text;

        // 2. Build AI Prompt
        const prompt = `
        You are an expert career counselor and technical evaluator. 
        Analyze the following resume text against the target role: "${role}".
        
        CRITICAL RULE: For the "identifiedSkills" array, you MUST ONLY include skills that are EXPLICITLY written in the resume text. DO NOT hallucinate, infer, or add any skills that are not literally present in the user's resume.
        
        Please provide the response in EXACTLY this JSON format (do not use markdown formatting like \`\`\`json):
        {
          "atsScore": 85,
          "identifiedSkills": ["skill 1", "skill 2"],
          "missingSkills": [
             { "skill": "Missing Skill Name", "studyLink": "https://www.youtube.com/results?search_query=Missing+Skill+Name+Crash+Course" }
          ],
          "roadmap": [
             { "week": 1, "focus": "Basics of missing skills", "tasks": ["Task A", "Task B"] },
             { "week": 2, "focus": "Intermediate concepts", "tasks": ["Task C", "Task D"] },
             { "week": 3, "focus": "Projects", "tasks": ["Task E", "Task F"] },
             { "week": 4, "focus": "Interview prep", "tasks": ["Task G", "Task H"] }
          ]
        }
        
        Resume:
        ${resumeText.substring(0, 5000)}
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
        res.status(500).json({ error: 'Failed to analyze resume.', details: error.message, stack: error.stack });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
