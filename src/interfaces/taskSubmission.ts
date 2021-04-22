/***************** Input from Client *****************************/
export interface MultipleChoiceBlockSubmission {
   taskId: string
   questionBlockId: string
   questionId: string
   answerIndex: number
}

export interface FreeResponseBlockSubmission {
   taskId: string
   questionBlockId: string
   questionId: string
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