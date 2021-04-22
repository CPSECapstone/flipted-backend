import { CompositeDBItem } from "../services/dynamodb";

/***************** Input from Client *****************************/
export interface QuestionAnswerInput {
   taskId: string
   questionBlockId: string
   questionId: string
}

export interface MultipleChoiceAnswerInput extends QuestionAnswerInput {
   answerIndex: number
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
}

export interface MultipleChoiceAnswerItem extends QuestionAnswerItem {
   answerIndex: number
}

export interface FreeResponseAnswerItem extends QuestionAnswerItem {
   answer: string
}

/***************** Internal Types ******************************/
export interface QuestionAnswer {
   username: string
   answerId: string
   taskId: string
   questionBlockId: string
}

export interface MultipleChoiceAnswer extends QuestionAnswer {
   answerIndex: number
}

export interface FreeResponseAnswer extends QuestionAnswer {
   answer: string
}
