export enum QuestionType {
   FR_QUESTION = "FR_QUESTION",
   MC_QUESTION = "MC_QUESTION"
}

export interface MCQuestionInput {
   description: string;
   options: string[];
   points: number;
   answers: number[];
}

export interface FRQuestionInput {
   description: string;
   points: number;
   answer: string;
}

export interface QuestionOption {
   id: number;
   description: string;
}

export interface Question {
   id: string;
   description: string;
   points: number;
}

export interface MCQuestion extends Question {
   options: QuestionOption[];
   answers: number[];
}

export interface FRQuestion extends Question {
   answer: string;
}
