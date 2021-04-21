import { uid } from "uid/secure";

import { QuizBlockInput } from "../interfaces/quizblock";
import { CompositeDBItem } from "./dynamodb";

export interface QuizBlockItem extends CompositeDBItem {
   blockId: string;
   title: string;
   requiredScore: number;
   points: number;
   questionIds: string[];
}

export function quizblockInputToDBItem(quizblock: QuizBlockInput): CompositeDBItem {
   const blockId = uid();

   const item: QuizBlockItem = {
      PK: `QUIZ_BLOCK#${blockId}`,
      SK: `QUIZ_BLOCK#${blockId}`,
      blockId,
      title: quizblock.title,
      requiredScore: quizblock.requiredScore,
      points: quizblock.points,
      questionIds: quizblock.questionIds
   };

   return item;
}
