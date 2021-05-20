/***************** Database item ******************************/
export interface QuestionItem extends DBItem {
   description: string;
   points: number;
}

export interface FrQuestionItem extends QuestionItem {
   answer: string;
}

export interface McQuestionItem extends QuestionItem {
   options: QuestionOption[];
   answers: number[];
}
