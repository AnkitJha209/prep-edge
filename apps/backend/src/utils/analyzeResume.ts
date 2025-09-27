import { QdrantVectorStore } from "@langchain/qdrant";
import { client } from "@repo/db/client"
import { embedding } from "./langchainFn";
import { OpenAI } from "openai";

const client_ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
export const analyzeTheApplication = async (jobId: string, fileName: string ) => {
    try {
        const job = await client.job.findUnique({
            where: {
                id: jobId
            }
        })
        if(!job){
            return "No job found"
        }

        const resumeVectorDb = await QdrantVectorStore.fromExistingCollection(embedding, {
            url: "http://localhost:6333",
            collectionName: fileName,
        });

        const resumeDocs = await resumeVectorDb.similaritySearch("resume", 1); // top document
        const resumeText = resumeDocs.map((doc) => doc.pageContent).join("\n");

        // 3️⃣ Prepare AI prompt
        const systemPrompt = `
        You are an expert recruitment assistant.
        Analyze a candidate's resume against a job description.
        Provide:
        1. Match score (0-100)
        2. Strengths (skills matched)
        3. Missing skills / gaps
        4. Feedback for candidate improvement
        `;

        const userPrompt = `
            Job Description:
            ${job}

            Candidate Resume:
            ${resumeText}
        `;

        // 4️⃣ Call AI for analysis
        const response = await client_ai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        const analysis = response.choices[0]?.message.content as string;

        return {
            success: true,
            jobId,
            resumeCollection: fileName,
            analysis: JSON.parse(analysis),
        };


    } catch (error) {
        console.log(error)
    }
}