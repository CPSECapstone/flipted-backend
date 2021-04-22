import { DBItem } from "../services/dynamodb";

export enum QuestionType {
   FR_QUESTION = "FR_QUESTION",
   MC_QUESTION = "MC_QUESTION"
}

/***************** Input from Client *****************************/
export interface QuestionInput {
   description: string;
   points: number;
}

export interface MCQuestionInput extends QuestionInput {
   options: string[];
   answers: number[];
}

export interface FRQuestionInput extends QuestionInput {
   answer: string;
}

/***************** Output to Client *****************************/
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

/***************** Database item ******************************/
export declare type QuestionItem = DBItem & QuestionInput;

export interface FRQuestionItem extends QuestionItem {
   answer: string;
}

export interface MCQuestionItem extends QuestionItem {
   options: QuestionOption[];
   answers: number[];
}
