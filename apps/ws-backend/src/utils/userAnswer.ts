import { client } from "@repo/db/client";
import { speechToText, textToSpeech } from "./elevenLabs";
import { saveToDB } from "./saveToDB";
import { evaluateAnswerAndGenerateNext } from "./aiEvaluation";

export const handleUserAnswer = async (
    audioBuffer: Buffer,
    questionId: string,
    interviewId: string,
    jobData: any,
    application: any,
    ws: any,
    shouldStop?: () => boolean,
) => {
    if (shouldStop?.()) {
        return;
    }

    console.log("Reached handleUserAnswer");
    const answerText = await speechToText(audioBuffer);

    if (shouldStop?.()) {
        return;
    }

    console.log(answerText);

    await client.interviewQuestion.update({
        where: { id: questionId },
        data: {
            answerText,
        },
    });

    if (shouldStop?.()) {
        return;
    }

    const { feedback, nextQuestion } = await evaluateAnswerAndGenerateNext(
        answerText,
        jobData,
        application,
        interviewId,
        questionId,
    );

    await client.interviewQuestion.update({
        where: { id: questionId },
        data: {
            aiEvaluation: feedback,
        },
    });

    if (shouldStop?.()) {
        return;
    }

    const newQuestionId = await saveToDB(nextQuestion, interviewId);
    const speech = await textToSpeech(nextQuestion);

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
