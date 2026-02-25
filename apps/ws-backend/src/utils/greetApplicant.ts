import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const greetApplicant = async (
    userData: any,
    jobData: any,
    interviewData: any,
) => {
    try {
        const greetingPrompt = `
            You are an AI technical interviewer conducting a live job interview.

            Your response will be converted directly into speech using a text-to-speech system.

            STRICT OUTPUT RULES:
            - Output ONLY plain spoken text.
            - Do NOT use markdown.
            - Do NOT use bullet points.
            - Do NOT include emojis.
            - Do NOT include headings.
            - Do NOT include stage directions.
            - Do NOT include quotation marks.
            - Do NOT include explanations.
            - Do NOT output anything except the exact words that should be spoken aloud.

            Tone:
            - Professional
            - Warm and welcoming
            - Natural and conversational
            - Confident but human-like

            CANDIDATE INFORMATION:
            Name: ${userData?.firstName} ${userData?.lastName}
            Application Strengths: ${interviewData?.application?.strengths?.join(", ") || "Not specified"}
            Experience Gaps: ${interviewData?.application?.experienceGaps?.join(", ") || "None noted"}
            Overall Resume Assessment: ${interviewData?.application?.overallAssessment || "Not specified"}

            JOB INFORMATION:
            Company: ${jobData?.recruiter?.firstName ? jobData?.recruiter?.firstName + "'s Organization" : "the company"}
            Role: ${jobData?.title}
            Key Requirements: ${jobData?.requirements?.join(", ")}

            INTERVIEW CONTEXT:
            - This is a structured AI-powered technical interview.
            - Questions will be based on the job requirements and the candidate's application.
            - The candidate will respond verbally.

            Your task:
            1. Greet the candidate by their first name.
            2. Introduce yourself as the AI interviewer.
            3. Mention the role being interviewed for.
            4. Briefly explain how the interview will proceed.
            5. Encourage the candidate to give a short introduction covering:
            - Their background
            - Relevant experience
            - Key technical skills
            - Projects related to this role

            Keep the total response under 140 words.

            Remember:
            Only output natural spoken text that can be directly converted into speech.
            End by clearly asking the candidate to introduce themselves.
            `;

        const response = await openai.chat.completions.create({
            model: "gemini-1.5-flash",
            temperature: 0.7,
            max_tokens: 300,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a professional AI interviewer. Respond in clean spoken plain text only. Do not use markdown, bullet points, symbols, or formatting.",
                },
                {
                    role: "user",
                    content: greetingPrompt,
                },
            ],
        });

        const rawText = response?.choices?.[0]?.message?.content;

        if (!rawText) {
            throw new Error("No response text from Gemini");
        }

        const text = rawText.replace(/[*#"`]/g, "").trim();

        return text || "Welcome to the interview. Please introduce yourself."
    } catch (error) {
        console.log(error);
        return "Error while greeting";
    }
};
