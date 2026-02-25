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
