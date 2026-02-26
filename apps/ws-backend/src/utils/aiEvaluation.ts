import { client } from "@repo/db/client";
import { openai } from "./greetApplicant";

export const evaluateAnswerAndGenerateNext = async (
    answerText: string,
    jobData: any,
    application: any,
    interviewId: string,
    questionId: string,
) => {
    try {
        const question = await client.interviewQuestion.findFirst({
            where: { id: questionId },
        });

        const previousQuestions = await client.interviewQuestion.findMany({
            where: {interviewId}
        })

        const response = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: `
                        You are a senior technical interviewer conducting a structured adaptive interview.

                    Your goals:
                    1. Evaluate the candidate's latest answer critically.
                    2. Adjust question difficulty dynamically.
                    3. Ask targeted follow-up questions based on:
                    - Job requirements
                    - Resume strengths
                    - Missing skills
                    - Previous performance
                    4. Avoid repeating questions.
                    5. Keep questions concise but deep.

                    Interview Strategy Rules:

                    - If answer is strong → increase depth or ask real-world implementation question.
                    - If answer is average → ask clarification or practical example.
                    - If answer is weak → ask simpler concept-based follow-up.
                    - If candidate lacks a required skill → test that area.
                    - Prefer problem-solving or scenario-based questions over theoretical definitions.
                    - Ask ONE question at a time.

                    Respond ONLY in valid JSON:

                    {
                    "feedback": "short but professional evaluation (2-3 lines)",
                    "performanceLevel": "strong | average | weak",
                    "nextQuestion": "next adaptive technical question",
                    "questionType": "TECHNICAL | PROBLEM_SOLVING | BEHAVIORAL"
                    }
                    `,
                },
                {
                    role: "user",
                    content: `
                        Candidate Name: ${application?.candidate?.firstName}
                        Role: ${jobData?.title}

                        Job Requirements:
                        ${jobData?.requirements?.join(", ")}

                        Candidate Resume Strengths:
                        ${application?.strengths?.join(", ")}

                        Missing Skills:
                        ${JSON.stringify(application?.missingSkills)}

                        Experience Gaps:
                        ${application?.experienceGaps?.join(", ")}

                        Previous Questions Asked:
                        ${previousQuestions.map((q, i) => `
                        Q${i+1}: ${q.questionText}
                        Answer: ${q.answerText}
                        AI Feedback: ${JSON.stringify(q.aiEvaluation)}
                        `).join("\n")}

                        Current Question:
                        ${question?.questionText}

                        Candidate Answer:
                        ${answerText}
                    `,
                },
            ],
        });
        const rawText = response?.choices?.[0]?.message?.content;

        if (!rawText) {
            throw new Error("No response text from Gemini");
        }

        return JSON.parse(rawText || "{}");
    } catch (error) {
        console.log(error);
        throw new Error("Can not evaluate the answer");
    }
};

export const analyzeInterview = async (
    interview: any,
    jobData: any,
    userData: any,
) => {
    try {
        const conversation = interview.questions
            .map((q: any, index: number) => {
                return `
                Question ${index + 1}: ${q.questionText}
                Candidate Answer: ${q.answerText || "No answer provided"}
                AI Feedback: ${q.aiEvaluation || "No feedback"}
                `;
            })
            .join("\n");

        const response: any = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `
                    You are a senior hiring manager generating a detailed final interview evaluation report.

                    Evaluation Criteria:
                    - Technical depth
                    - Problem-solving ability
                    - Communication clarity
                    - Practical experience
                    - Alignment with job requirements

                    Scoring Guide:
                    0-3  → Very weak
                    4-6  → Below average
                    7-8  → Strong
                    9-10 → Exceptional

                    Be objective and critical.

                    Respond ONLY in valid JSON:

                    {
                    "summary": "Detailed professional summary (5-8 lines)",
                    "strengths": "Bullet point strengths",
                    "weaknesses": "Bullet point weaknesses",
                    "technicalDepthScore": number (0-10),
                    "problemSolvingScore": number (0-10),
                    "communicationScore": number (0-10),
                    "overallScore": number (0-10),
                    "aiRecommendation": "Strong Hire | Hire | Consider | No Hire"
                    }
                    `,
                },
                {
                    role: "user",
                    content: `
                    Candidate Name: ${userData?.name}
                    Role Applied: ${jobData?.title}

                    Interview Conversation:
                    ${conversation}
                    `,
                },
            ],
        });

        const content = response.choices[0].message?.content;

        if (!content) {
            throw new Error("Empty AI response");
        }

        const report = JSON.parse(content);

        return report;
    } catch (error) {
        console.error("ANALYZE ERROR:", error);
        throw new Error("Interview analysis failed");
    }
};
