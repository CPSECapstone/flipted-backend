import { CompositeDBItem } from "../services/dynamodb";

/***************** Database item ******************************/
export interface TaskProgressItem extends CompositeDBItem {
   PK: string; //username
   SK: string; //taskid
   finishedRequirementIds: string[];
   username: string;
}

export interface QuestionAnswerItem {
   PK: string;
   SK: string;
   taskId: string;
   questionBlockId: string;
   pointsAwarded: number;
}

export interface MultipleChoiceAnswerItem extends QuestionAnswerItem {
   answerIndex: number;
}

export interface FreeResponseAnswerItem extends QuestionAnswerItem {
   answer: string;
}

export interface TaskSubmissionResultItem {
   PK: string; // #TASK_SUBMISSION + username
   SK: string; // task id
   graded: boolean;
   pointsAwarded: number;
   pointsPossible: number;
   teacherComment?: string;
   questionAndAnswers?: QuestionAndAnswer[];
}

/***************** Internal Types ******************************/
export interface Answer {
   username: string;
   questionId: string;
   taskId: string;
   questionBlockId: string;
   pointsAwarded: number;
}

export interface MultipleChoiceAnswer extends Answer {
   answerId: number;
}

export interface FreeResponseAnswer extends Answer {
   answer: string;
}

/** Mirrors GraphQL return type */
export interface TaskSubmissionResult {
   graded: boolean;
   taskId: string;
   pointsAwarded: number;
   pointsPossible: number;
   teacherComment?: string;
   questionAndAnswers?: QuestionAndAnswer[];
}

export interface QuestionAndAnswer {
   question: Question;
   answer: AnswerOut;
}

export interface AnswerOut {
   questionId: string;
   pointsAwarded?: number;
   answer: string;
}

export interface QuestionProgress {
   taskId: string;
   answers: AnswerOut[];
}
