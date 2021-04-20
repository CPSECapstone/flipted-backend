export interface MCQuestionInput {
   blockId: string;
   description: string;
   options: string[];
   points: number;
   answers: number[];
}

export interface FRQuestionInput {
   blockId: string;
   description: string;
   points: number;
   answer: string;
}

export interface QuizBlockInput {
   blockId?: string;
   title: string;
   points: number;
   requiredScore: number;
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

export interface QuizBlock {
   id: string;
   title: string;
   requiredScore: number;
   questions: Question[];
}
