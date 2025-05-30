export interface Exam {
    _id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    totalMarks: number;
    passingMarks: number;
    numberOfQuestions: number;
    questions: any[];
    marksPerQuestion: number;
    attemptCount: number;
    hints: number;
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
    subjectId: string;
}

export interface Subject {
    _id: string;
    name: string;
    description: string;
    code: string;
};

export interface Student {
    email: string;
    name: string;
    _id: string;
    prn: string;
    joined: string;
}

export interface Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
    hint: string;
    _id: string
}