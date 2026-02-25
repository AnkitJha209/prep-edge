import { client } from "@repo/db/client";
import { speechToText, textToSpeech } from "./elevenLabs";
import { saveToDB } from "./saveToDB";
import { evaluateAnswerAndGenerateNext } from "./aiEvaluation";

export const handleUserAnswer = async (
    audioBuffer: Buffer,
    questionId: string,
    interviewId: string,
    ws: any,
) => {
    const answerText = await speechToText(audioBuffer);

    // 3️⃣ Evaluate answer + generate next question
    const { feedback, nextQuestion } = await evaluateAnswerAndGenerateNext(
        answerText,
        questionId,
    );

    // 4️⃣ Save evaluation
    await client.interviewQuestion.update({
        where: { id: questionId },
        data: {
            answerText,
            aiEvaluation: feedback,
        },
    });

    const newQuestionId = await saveToDB(nextQuestion, interviewId);

    // 6️⃣ Convert next question → speech
    const speech = await textToSpeech(nextQuestion);

    // 7️⃣ Send to frontend
    ws.send(
        JSON.stringify({
            type: "AI_MESSAGE_START",
            questionId: newQuestionId,
            text: nextQuestion,
            audioIncoming: true,
        }),
    );

    ws.send(speech);

    ws.send(
        JSON.stringify({
            type: "AI_MESSAGE_END",
            questionId: newQuestionId,
        }),
    );
};
