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
   graded: boolean
   teacherComment?: string
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
   pointsAwarded?: number;
   pointsPossible?: number;
   teacherComment?: string;
   missionId: string;
   course: string;
   username: string;
   questionAndAnswers?: QuestionAndAnswer[]
}

/***************** Internal Types ******************************/
export interface Answer {
   username: string;
   questionId: string;
   taskId: string;
   questionBlockId: string;
   pointsAwarded: number;
   graded: boolean
   teacherComment?: string
}

export interface MultipleChoiceAnswer extends Answer {
   answerId: number;
}

export interface FreeResponseAnswer extends Answer {
   answer: string;
}

export interface AnswerOut {
   questionId: string;
   pointsAwarded?: number;
   answer: string;
   graded: boolean
   teacherComment?: string
}

export interface QuestionProgress {
   taskId: string;
   answers: AnswerOut[];
}

export interface TaskSubmissionResultInternal {
   taskId: string,
   nonQuestionPoints: number,
   graded: boolean,
   username: string,
   teacherComment?: string,
   answers: Answer[]
}
