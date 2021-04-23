import { CompositeDBItem } from "../services/dynamodb";
import { Question } from "./question";

/***************** Input from Client *****************************/
export interface QuestionAnswerInput {
   taskId: string
   questionBlockId: string
   questionId: string
}

export interface MultipleChoiceAnswerInput extends QuestionAnswerInput {
   answerId: number
}

export interface FreeResponseAnswerInput extends QuestionAnswerInput {
   answer: string
}

export interface TaskProgressInput {
   taskId: string;
   finishedRequirementIds: string[];
}

export interface TaskProgress {
   username: string;
   taskId: string;
   finishedRequirementIds: string[];
}

/***************** Database item ******************************/
export interface TaskProgressItem extends CompositeDBItem {
   PK: string; //username
   SK: string; //taskid
   finishedRequirementIds: string[];
   username: string
}

export interface QuestionAnswerItem {
   PK: string
   SK: string
   taskId: string
   questionBlockId: string
   pointsAwarded: number
}

export interface MultipleChoiceAnswerItem extends QuestionAnswerItem {
   answerIndex: number
}

export interface FreeResponseAnswerItem extends QuestionAnswerItem {
   answer: string
}

/***************** Internal Types ******************************/
export interface Answer {
   username: string
   questionId: string
   taskId: string
   questionBlockId: string
   pointsAwarded: number
}

export interface MultipleChoiceAnswer extends Answer {
   answerId: number
}

export interface FreeResponseAnswer extends Answer {
   answer: string
}

/** Mirrors GraphQL return type */
export interface TaskSubmissionResult {
   graded: boolean
   taskId: string
   pointsAwarded: number
   pointsPossible: number
   teacherComment?: string
   questionAndAnswers?: QuestionAndAnswer[]
}

export interface QuestionAndAnswer {
   question: Question
   answer: AnswerOut
}

export interface AnswerOut {
   pointsAwarded: number
   answer: string
}
