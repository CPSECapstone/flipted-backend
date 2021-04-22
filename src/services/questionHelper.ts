import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";

import {
   FRQuestionInput,
   FRQuestionItem,
   MCQuestionInput,
   MCQuestionItem,
   Question,
   QuestionItem,
   FRQuestion,
   MCQuestion
} from "../interfaces/question";

export function gradeMultipleChoiceQuestion(question: MCQuestion, answerIndex: number) : number {
   return question.answers.includes(answerIndex) ? question.points : 0
}

// convert input from request to a item object that will be inserted into db
export function frQuestionInputToDBItem(question: FRQuestionInput): QuestionItem {
   const questionId = uid();

   const questionItem: FRQuestionItem = {
      id: `FR_QUESTION#${questionId}`,
      description: question.description,
      points: question.points,
      answer: question.answer
   };

   return questionItem;
}

// convert input from request to a item object that will be inserted into db
export function mcQuestionInputToDBItem(question: MCQuestionInput): QuestionItem {
   const options = question.options.map((option: string, index: number) => {
      return {
         id: index,
         description: option
      };
   });

   const questionId = uid();

   const questionItem: MCQuestionItem = {
      id: `MC_QUESTION#${questionId}`,
      description: question.description,
      points: question.points,
      options,
      answers: question.answers
   };

   return questionItem;
}

// convert row database item result to Question array
export function dbResponsesToQuestions(items: any[]): Question[] {
   const questions: Question[] = items.map((item: any) => {
      const questionItem = unmarshall(item);
      const splits = questionItem.id.split("#");
      const type = splits[0];
      const id = splits[1];
      if (type === "MC_QUESTION") {
         return <MCQuestion>{
            id,
            description: questionItem.description,
            points: questionItem.points,
            options: questionItem.options,
            answers: questionItem.answers
         };
      } else if (type === "FR_QUESTION") {
         return <FRQuestion>{
            id,
            description: questionItem.description,
            points: questionItem.points,
            answer: questionItem.answer
         };
      } else {
         throw new Error("Unknown Question Type");
      }
   });

   return questions;
}
