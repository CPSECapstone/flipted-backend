import { uid } from "uid/secure";

import {
   FRQuestionInput,
   MCQuestionInput,
   QuestionOption,
   QuizBlockInput
} from "../interfaces/quizblock";

interface DBItem {
   PK: string;
   SK: string;
}

interface QuizBlockItem extends DBItem {
   blockId: string;
   title: string;
   requiredScore: number;
   points: number;
}

interface FRQuestionDBItem extends DBItem {
   questionId: string;
   description: string;
   points: number;
   answer: string;
}

interface MCQuestionDBItem extends DBItem {
   questionId: string;
   description: string;
   points: number;
   options: QuestionOption[];
   answers: number[];
}

export function quizblockInputToDBItem(quizblock: QuizBlockInput): DBItem {
   const blockId = uid();

   const item: QuizBlockItem = {
      PK: `QUIZ_BLOCK#${blockId}`,
      SK: `QUIZ_BLOCK#${blockId}`,
      blockId,
      title: quizblock.title,
      requiredScore: quizblock.requiredScore,
      points: quizblock.points
   };

   return item;
}

// convert input from request to a item object that will be inserted into db
export function mcQuestionInputToDBItems(question: MCQuestionInput): DBItem[] {
   const options = question.options.map((option: string, index: number) => {
      return {
         id: index,
         description: option
      };
   });

   const questionId = uid();

   const questionItem: MCQuestionDBItem = {
      PK: `MC_QUESTION#${questionId}`,
      SK: `MC_QUESTION#${questionId}`,
      questionId,
      description: question.description,
      points: question.points,
      options,
      answers: question.answers
   };

   const relationItem: DBItem = {
      PK: `QUIZ_BLOCKN#${question.blockId}`,
      SK: `MC_QUESTION#${questionId}`
   };

   return [questionItem, relationItem];
}

// convert input from request to a item object that will be inserted into db
export function frQuestionInputToDBItems(question: FRQuestionInput): DBItem[] {
   const questionId = uid();

   const questionItem: FRQuestionDBItem = {
      PK: `FR_QUESTION#${questionId}`,
      SK: `FR_QUESTION#${questionId}`,
      questionId,
      description: question.description,
      points: question.points,
      answer: question.answer
   };

   const relationItem: DBItem = {
      PK: `QUIZ_BLOCKN#${question.blockId}`,
      SK: `FR_QUESTION#${questionId}`
   };

   return [questionItem, relationItem];
}
