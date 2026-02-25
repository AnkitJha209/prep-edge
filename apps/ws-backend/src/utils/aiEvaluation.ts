import { client } from "@repo/db/client";
import { openai } from "./greetApplicant";

export const evaluateAnswerAndGenerateNext = async (
    answerText: string,
    questionId: string,
) => {
    try {
        const question = await client.interviewQuestion.findFirst({
            where: { id: questionId },
        });

        const response = await openai.chat.completions.create({
            model: "gemini-1.5-flash",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: `
                        You are a strict technical interviewer.
                        Respond in JSON format:
                        {
                        "feedback": "short evaluation",
                        "nextQuestion": "next technical question"
                        }
                    `,
                },
                {
                    role: "user",
                    content: `
                        Question: ${question?.questionText}
                        Candidate Answer: ${answerText}
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
        // 1️⃣ Structure interview transcript
        const conversation = interview.questions
            .map((q: any, index: number) => {
                return `
                Question ${index + 1}: ${q.questionText}
                Candidate Answer: ${q.answerText || "No answer provided"}
                AI Feedback: ${q.aiEvaluation || "No feedback"}
                `;
            })
            .join("\n");

        // 2️⃣ Call LLM
        const response: any = await openai.chat.completions.create({
            model: "gemini-1.5-flash", // or gemini-1.5-flash if using gemini
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `
                    You are a senior technical interviewer generating a final structured hiring report.

                    Respond ONLY in valid JSON format:
                    {
                    "summary": "detailed summary",
                    "strengths": "bullet style strengths",
                    "weaknesses": "bullet style weaknesses",
                    "overallScore": number between 0 and 10,
                    "aiRecommendation": "Hire / Strong Hire / No Hire / Consider"
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

        // 3️⃣ Parse JSON safely
        const report = JSON.parse(content);

        return report;
    } catch (error) {
        console.error("ANALYZE ERROR:", error);
        throw new Error("Interview analysis failed");
    }
};
