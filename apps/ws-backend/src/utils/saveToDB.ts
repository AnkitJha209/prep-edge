import { client } from "@repo/db/client";

export const saveToDB = async (
    questionText: string,
    interviewId: string,
) => {
    try {
        // Check interview exists
        const interview = await client.interview.findUnique({
            where: { id: interviewId },
            select: { id: true },
        });

        if (!interview) {
            throw new Error("Interview not found");
        }
        const lastQuestion = await client.interviewQuestion.findFirst({
            where: { interviewId },
            orderBy: { orderIndex: "desc" },
            select: { orderIndex: true },
        });

        const nextOrderIndex = lastQuestion ? lastQuestion.orderIndex + 1 : 1;

        const interviewQuestion = await client.interviewQuestion.create({
            data: {
                interviewId,
                questionText,
                questionType: "TECHNICAL",
                orderIndex: nextOrderIndex,
            },
            select: {
                id: true,
            },
        });

        return interviewQuestion.id;
    } catch (error) {
        console.error("SaveToDB Error:", error);
        throw error;
    }
};
