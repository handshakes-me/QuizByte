import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Question {
    _id: string;
    questionText: string;
    options: string[];
    createdAt: string;
    updatedAt: string;
    hintExists: boolean;
    hint?: string
}

interface ExamData {
    _id: string;
    title: string;
    hints: number;
    duration: number;
    totalMarks: number;
    startTime: string;
    endTime: string;
    questions: Question[];
}

type Answer = {
    questionId: string;
    selectedAnswer: string;
};

interface ExamAttemptState {
    examId: string | null;
    title: string;
    duration: number;
    totalMarks: number;
    hints: number;
    startTime: string | null;
    endTime: string | null;
    questions: Question[];
    attemptedQuestions: Answer[]; // changed to array of answers
    currentQuestionIndex: number;
    hintsUsed: number;
    startedAt: string | null;
    examAttemptId: string;
}

interface ExamAttempt {
    hintsUsed: number;
    startTime: string;
    _id: string;
}

const initialState: ExamAttemptState = {
    examId: null,
    title: '',
    duration: 0,
    totalMarks: 0,
    startTime: null,
    endTime: null,
    questions: [],
    attemptedQuestions: [],
    currentQuestionIndex: 0,
    hintsUsed: 0,
    startedAt: null,
    hints: 0,
    examAttemptId: '',
};

const examAttemptSlice = createSlice({
    name: 'examAttempt',
    initialState,
    reducers: {
        setExamData: (
            state,
            action: PayloadAction<{ exam: ExamData; examAttempt: ExamAttempt }>
        ) => {
            const { exam, examAttempt } = action.payload;
            state.examId = exam._id;
            state.title = exam.title;
            state.duration = exam.duration;
            state.hints = exam.hints;
            state.totalMarks = exam.totalMarks;
            state.startTime = exam.startTime;
            state.endTime = exam.endTime;
            state.questions = exam.questions || [];
            state.attemptedQuestions = [];
            state.currentQuestionIndex = 0;
            state.hintsUsed = examAttempt.hintsUsed;
            state.startedAt = examAttempt.startTime;
            state.examAttemptId = examAttempt._id;
        },
        setAnswer: (state, action: PayloadAction<Answer>) => {
            const { questionId, selectedAnswer } = action.payload;
            const existingAnswer = state.attemptedQuestions.find(
                (ans) => ans.questionId === questionId
            );

            if (existingAnswer) {
                existingAnswer.selectedAnswer = selectedAnswer;
            } else {
                state.attemptedQuestions.push({ questionId, selectedAnswer });
            }
        },
        setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
            state.currentQuestionIndex = action.payload;
        },
        setHintUsed: (state, action: PayloadAction<number>) => {
            state.hintsUsed = action.payload;
        },
        setQuestionHint: (state, acton: PayloadAction<{_id: string, hint: string}>) => {
            const { _id, hint } = acton.payload;
            const question = state.questions.find((q) => q._id === _id);
            if (question) {
                question.hint = hint;
            }
        },
        resetExamAttempt: () => initialState,
    },
});

export const {
    setExamData,
    setAnswer,
    setCurrentQuestionIndex,
    resetExamAttempt,
    setQuestionHint,
    setHintUsed
} = examAttemptSlice.actions;

export default examAttemptSlice.reducer;
