export interface MultipleChoiceBlockSubmission {
   taskId: string
   questionBlockId: string
   questionId: string
   answerIndex: number
}

export interface FreeResponseBlockSubmission {
   taskId: string
   questionBlockId: string
   answerId: string 
}