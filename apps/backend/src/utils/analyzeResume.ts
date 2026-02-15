import { client } from "@repo/db/client";
import { OpenAI } from "openai";
import {PDFParse} from "pdf-parse";

const client_ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
export const analyzeTheApplication = async (jobId: string, fileUrl: string) => {
    try {
        const job = await client.job.findFirst({
            where: {
                id: jobId,
            },
        });
        if (!job) {
            return "No job found";
        }
        const parser = new PDFParse({url: fileUrl})
        const parsedResume =await parser.getText();
        const systemPrompt = `
            You are a senior technical recruitment analyst with expertise in resume screening and ATS evaluation.

            Evaluate how well the candidate’s resume matches the job description.

            Analyze:
            - Technical skills
            - Tools & technologies
            - Relevant experience
            - Domain knowledge
            - Seniority alignment
            - Education (if relevant)

            Return your response STRICTLY in the following JSON format:

            {
            "matchScore": number,                // 0–100
            "scoreJustification": string,        // 2–3 concise lines
            "strengths": [
                string
            ],
            "missingSkills": {
                "critical": [ string ],
                "minor": [ string ]
            },
            "experienceGaps": [
                string
            ],
            "improvementSuggestions": [
                string
            ],
            "overallAssessment": string          // Short professional summary (3–4 lines)
            }

            Rules:
            - Do not include any text outside the JSON.
            - Do not hallucinate skills.
            - Base evaluation only on provided resume.
            - Be objective and recruiter-focused.
        `;

        const userPrompt = `
            Job Description:
            Title: ${job.title}
            Description: ${job.description}
            Requirements: ${job.requirements}

            Candidate Resume:
            ${parsedResume.text}
        `;


        const response = await client_ai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        const analysis = response.choices[0]?.message.content as string;
        await parser.destroy();
        return {
            success: true,
            jobId,
            analysis: JSON.parse(analysis),
        };
    } catch (error) {
        console.log(error);
    }
};
