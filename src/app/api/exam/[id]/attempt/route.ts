import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import examAttemptModel from "@/models/examAttempt.model";
import examGroupModel from "@/models/examGroup.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

type Answer = {
    questionId: string;
    selectedAnswer: string;
}

type Questions = {
    _id: string;
    examId: string;
    questionText: string,
    options: string[];
    correctAnswer: string;
    hint?: string,
    explaination?: string,
}

type ValidatedAnswer = {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

const validateAnswers = (answers: Answer[], questions: Questions[]): ValidatedAnswer[] => {

    if (!Array.isArray(answers)) {
        throw new Error("Answers must be an array");
    }

    if (!answers.every((answer: Answer) => typeof answer === "object" && answer !== null && "questionId" in answer && "selectedAnswer" in answer)) {
        throw new Error("Each answer must be an object with 'questionId' and 'selectedAnswer' properties");
    }

    if (!questions.every((question: Questions) => typeof question === "object" && question !== null && "_id" in question && "examId" in question && "questionText" in question && "options" in question && "correctAnswer" in question)) {
        throw new Error("Each question must be an object with '_id', 'examId', 'questionText', 'options', and 'correctAnswer' properties");
    }

    const validatedAnswers = answers.map((answer: Answer) => {
        const question = questions.find((q: Questions) => q._id.toString() === answer.questionId);

        if (!question) {
            throw new Error(`Question with ID ${answer.questionId} not found`);
        }

        if (answer.selectedAnswer === question.correctAnswer) {
            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: true,
            }
        } else {
            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: false,
            }
        }
    })

    return validatedAnswers
}

const calculateMarks = (validatedAnswers: ValidatedAnswer[], marksPerQuestion: number): number => {
    return validatedAnswers.reduce((acc, answer) => {
        if (answer.isCorrect) {
            return acc + marksPerQuestion;
        }
        return acc;
    }, 0);
}

// initiate exam attempt
export const GET = async (req: requestType, { params }: { params: { id: string } }) => {
    try {

        // db connect
        await dbConnect()

        // auth
        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        // get user id  
        const { id: userId } = req.user;

        // const examId
        const examId = await params.id

        if (!examId) {
            return NextResponse.json({
                success: false,
                message: "Exam id is required"
            }, { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return NextResponse.json({
                success: false,
                message: "Invalid exam id"
            }, { status: 400 })
        }

        // fetch exam details
        const exam = await examModel.findById(examId).populate("questions").exec();
        if (!exam) {
            return NextResponse.json({
                success: false,
                message: "Exam not found"
            }, { status: 404 })
        }

        // fetch exam group details
        const examGroupId = exam.examGroupId
        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({
                success: false,
                message: "Exam group not found"
            }, { status: 404 })
        }

        // validate if student is allowed to attend this exam
        if (!examGroup.students.includes(userId)) {
            return NextResponse.json({
                success: false,
                message: "You are not authorized to attempt this exam"
            }, { status: 401 })
        }

        // validate if student has completed all the allowed attempts for this exam
        const examAttempts = await examAttemptModel.find({ examId, studentId: userId }) || []

        // find any existing exam attempt is active
        const existingAttempt = examAttempts.find(attempt => attempt.status === "in-progress")
        if (existingAttempt) {
            // remove sensitive info from exam
            exam.examGroupId = undefined
            exam.attemptCount = undefined
            exam.passingMarks = undefined
            exam.questions.forEach((question: any) => {
                question.correctAnswer = undefined
                question.hint = undefined
                question.explaination = undefined
                question.examId = undefined
            })

            return NextResponse.json({
                success: true,
                message: "You have already started the exam",
                data: {
                    exam,
                    examAttempt: {
                        _id: existingAttempt._id,
                        startTime: existingAttempt.startTime,
                        status: existingAttempt.status,
                    }
                }
            }, { status: 200 })
        }

        if (examAttempts.length >= exam.attemptCount) {
            return NextResponse.json({
                success: false,
                message: "You have completed all the attempts for the following exam"
            }, { status: 400 })
        }

        if (exam.status !== "ongoing") {
            return NextResponse.json({
                success: false,
                message: "You are not allowed to attempt this exam at this time"
            }, { status: 400 })
        }

        // create new examattempt instance in db
        const newExamAttempt = new examAttemptModel({
            examId,
            studentId: userId,
            attemptCount: examAttempts.length + 1,
            startTime: new Date(),
            status: "in-progress",
            totalMarks: exam.totalMarks,
        })

        await newExamAttempt.save()

        // remove sensitive info from exam
        exam.examGroupId = undefined
        exam.attemptCount = undefined
        exam.passingMarks = undefined
        exam.questions.forEach((question: any) => {
            question.correctAnswer = undefined
            question.hint = undefined
            question.explaination = undefined
            question.examId = undefined
        })

        // return exam questions to be desplyed in the frontend
        return NextResponse.json({
            success: true,
            message: "Exam attempt started successfully",
            data: {
                exam,
                examAttempt: {
                    _id: newExamAttempt._id,
                    startTime: newExamAttempt.startTime,
                    status: newExamAttempt.status,
                }
            }
        }, { status: 200 })

    } catch (error) {
        console.log("error : ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error
        }, { status: 500 })
    }
}

// submit exam attempt
export const POST = async (req: requestType, { params }: { params: { id: string } }) => {
    try {

        // db connect
        await dbConnect()

        // auth
        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        // get user id
        const { id: userId } = req.user;

        // get exam data
        const examId = await params.id

        const {
            attemptId,
            answers,
            autoSubmitted,
            hintsUsed
        } = await req.json()

        const attempt = await examAttemptModel.findById(attemptId)
        if (!attempt) {
            return NextResponse.json({ success: false, message: "Exam attempt not found" }, { status: 404 });
        }

        if (attempt.studentId.toString() !== userId) {
            return NextResponse.json({ success: false, message: "You are not authorized to submit this exam attempt" }, { status: 401 });
        }

        if (attempt.status !== "in-progress") {
            return NextResponse.json({ success: false, message: "You have already submitted this exam attempt" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return NextResponse.json({ success: false, message: "Invalid exam id" }, { status: 400 });
        }

        const exam = await examModel.findById(examId).populate("questions").exec();
        if (!exam) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }

        const validatedAnswers = validateAnswers(answers, exam.questions)
        const obtainedMarks = calculateMarks(validatedAnswers, exam.marksPerQuestion)

        attempt.status = "completed"
        attempt.submittedAt = new Date()
        attempt.timeTaken = (attempt.submittedAt.getTime() - attempt.startTime.getTime()) / 1000
        attempt.attemptedQuestions = validatedAnswers
        attempt.hintsUsed = hintsUsed
        attempt.obtainedMarks = obtainedMarks
        attempt.autoSubmitted = autoSubmitted

        attempt.save();

        return NextResponse.json({ success: true, message: "Exam attempt submitted successfully", data: { exam, attempt } }, { status: 200 });

    } catch (error) {
        console.log("error submitting exam : ", error);
        return NextResponse.json({ success: false, message: "Error while submitting exam", error }, { status: 500 });
    }
}