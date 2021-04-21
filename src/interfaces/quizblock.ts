import { Question } from "./question";

export interface QuizBlockInput {
   blockId?: string;
   title: string;
   points: number;
   requiredScore: number;
   questionIds: string[];
}

export interface QuizBlock {
   id: string;
   title: string;
   points: number;
   requiredScore: number;
   questions: Question[];
}
