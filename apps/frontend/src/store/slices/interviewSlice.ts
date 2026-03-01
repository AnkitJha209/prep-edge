import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InterviewState {
    interviewToken: string | null;
    isInterviewActive: boolean;
    currentQuestionId: string | null;
    currentQuestionText: string | null;
    isAiSpeaking: boolean;
    isRecording: boolean;
    messages: Array<{
        id: string;
        role: "ai" | "user";
        text: string;
        questionId: string;
    }>;
}

const initialState: InterviewState = {
    interviewToken: null,
    isInterviewActive: false,
    currentQuestionId: null,
    currentQuestionText: null,
    isAiSpeaking: false,
    isRecording: false,
    messages: [],
};

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers: {
        setInterviewToken(state, action: PayloadAction<string>) {
            state.interviewToken = action.payload;
        },
        startInterview(state) {
            state.isInterviewActive = true;
            state.messages = [];
        },
        addAiMessage(
            state,
            action: PayloadAction<{
                questionId: string;
                text: string;
                id?: string;
            }>,
        ) {
            state.currentQuestionId = action.payload.questionId;
            state.currentQuestionText = action.payload.text;
            state.isAiSpeaking = true;
            state.messages.push({
                id: action.payload.id || crypto.randomUUID(),
                role: "ai",
                text: action.payload.text,
                questionId: action.payload.questionId,
            });
        },
        aiMessageEnd(state) {
            state.isAiSpeaking = false;
        },
        setRecording(state, action: PayloadAction<boolean>) {
            state.isRecording = action.payload;
        },
        addUserMessage(
            state,
            action: PayloadAction<{ questionId: string; text: string }>,
        ) {
            state.messages.push({
                id: crypto.randomUUID(),
                role: "user",
                text: action.payload.text,
                questionId: action.payload.questionId,
            });
        },
        endInterview(state) {
            state.isInterviewActive = false;
            state.isAiSpeaking = false;
            state.isRecording = false;
            state.currentQuestionId = null;
            state.currentQuestionText = null;
        },
        resetInterview() {
            return initialState;
        },
    },
});

export const {
    setInterviewToken,
    startInterview,
    addAiMessage,
    aiMessageEnd,
    setRecording,
    addUserMessage,
    endInterview,
    resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
