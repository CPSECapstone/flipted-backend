import { Task } from "./interfaces/taskInterfaces";

export interface StudentAnswer {
   questionId: string;
   points: number;
   result: boolean;
   choices: string[];
}

export interface QuizTaskSubmissionSummary {
   id: string;
   taskId: string;
   student: string;
   points: number;
   startedAt: Date;
   sumbittedAt: Date;
   results: StudentAnswerResult[];
}

export interface QuizTaskSubmission {
   submission: QuizTaskSubmissionSummary;
   task: Task;
}

export interface QuizTaskSubmissionInput {
   student: string;
   taskId: string;
   answers: StudentAnswerInput[];
}

export interface StudentAnswerInput {
   questionId: string;
   choices: number[];
}

export interface StudentAnswerResult {
   questionId: string;
   result: boolean;
   points: number;
   choices: number[];
   correctChoices: number[];
}

export interface LearningObjective {
   id: string;
   name: string;
   course: string;
   description: string;
}
export interface LearningObjectiveInput {
   name: string;
   course: string;
   description: string;
}

export interface CourseInput {
   name: string;
   instructor: string;
   description: string;
}

export interface User {
   id: string;
   role: string;
   firstName: string;
   lastName: string;
   email: string;
}

export interface UpdateUserInput {
   firstName: string;
   lastName: string;
}
