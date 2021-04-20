import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";

import {
   FRQuestionInput,
   MCQuestionInput,
   QuestionOption,
   Question,
   FRQuestion,
   MCQuestion
} from "../interfaces/question";

import { DBItem } from "./dynamodb";

export interface QuestionItem extends DBItem {
   description: string;
   points: number;
}

interface FRQuestionDBItem extends QuestionItem {
   answer: string;
}

interface MCQuestionDBItem extends QuestionItem {
   options: QuestionOption[];
   answers: number[];
}

// convert input from request to a item object that will be inserted into db
export function frQuestionInputToDBItem(question: FRQuestionInput): QuestionItem {
   const questionId = uid();

   const questionItem: FRQuestionDBItem = {
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

   const questionItem: MCQuestionDBItem = {
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
      const id = questionItem.id;
      if (id.startsWith("MC_QUESTION#")) {
         return <MCQuestion>{
            id: questionItem.questionId,
            description: questionItem.description,
            points: questionItem.points,
            options: questionItem.options,
            answers: questionItem.answers
         };
      } else if (id.startsWith("FR_QUESTION#")) {
         return <FRQuestion>{
            id: questionItem.questionId,
            description: questionItem.description,
            points: questionItem.points,
            answer: questionItem.answers
         };
      } else {
         throw new Error("Unknown Question Type");
      }
   });

   return questions;
}
