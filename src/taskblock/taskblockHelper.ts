import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";

import {
   TaskBlockItem,
   TextBlockItem,
   ImageBlockItem,
   VideoBlockItem,
   QuizBlockItem,
   FrBlockItem,
   McBlockItem
} from "./taskblockInterface";

export function textblockInputToDBItem(textblock: TextBlockInput): TaskBlockItem {
   const blockId = uid();
   const item: TextBlockItem = {
      PK: `TASK#${textblock.taskId}`,
      SK: `TEXT_BLOCK#${blockId}`,
      blockId,
      title: textblock.title,
      pageIndex: textblock.pageIndex,
      blockIndex: textblock.blockIndex,
      contents: textblock.contents,
      fontSize: textblock.fontSize
   };

   return item;
}

export function imageblockInputToDBItem(imageblock: ImageBlockInput): TaskBlockItem {
   const blockId = uid();
   const item: ImageBlockItem = {
      PK: `TASK#${imageblock.taskId}`,
      SK: `IMAGE_BLOCK#${blockId}`,
      blockId,
      title: imageblock.title,
      pageIndex: imageblock.pageIndex,
      blockIndex: imageblock.blockIndex,
      imageUrl: imageblock.imageUrl
   };

   return item;
}

export function videoblockInputToDBItem(videoblock: VideoBlockInput): TaskBlockItem {
   const blockId = uid();
   const item: VideoBlockItem = {
      PK: `TASK#${videoblock.taskId}`,
      SK: `VIDEO_BLOCK#${blockId}`,
      blockId,
      title: videoblock.title,
      pageIndex: videoblock.pageIndex,
      blockIndex: videoblock.blockIndex,
      videoUrl: videoblock.videoUrl
   };

   return item;
}

export function quizblockInputToDBItem(quizblock: QuizBlockInput): TaskBlockItem {
   const blockId = uid();
   const item: QuizBlockItem = {
      PK: `TASK#${quizblock.taskId}`,
      SK: `QUIZ_BLOCK#${blockId}`,
      blockId,
      title: quizblock.title,
      pageIndex: quizblock.pageIndex,
      blockIndex: quizblock.blockIndex,
      requiredScore: quizblock.requiredScore,
      points: quizblock.points,
      questionIds: quizblock.questionIds
   };

   return item;
}

export function frBlockInputToDBItem(frBlock: FrBlockInput): TaskBlockItem {
   const blockId = uid();

   const item: FrBlockItem = {
      PK: `TASK#${frBlock.taskId}`,
      SK: `FR_BLOCK#${blockId}`,
      blockId,
      title: frBlock.title,
      pageIndex: frBlock.pageIndex,
      blockIndex: frBlock.blockIndex,
      stem: frBlock.stem,
      points: frBlock.points,
      answer: frBlock.answer
   };

   return item;
}

export function mcBlockInputToDBItem(mcBlock: McBlockInput): TaskBlockItem {
   const blockId = uid();

   const item: McBlockItem = {
      PK: `TASK#${mcBlock.taskId}`,
      SK: `MC_BLOCK#${blockId}`,
      blockId,
      title: mcBlock.title,
      pageIndex: mcBlock.pageIndex,
      blockIndex: mcBlock.blockIndex,
      stem: mcBlock.stem,
      points: mcBlock.points,
      options: mcBlock.options,
      answers: mcBlock.answers
   };

   return item;
}

export function dbItemsToTaskBlocks(rawItems: any[]): TaskBlock[] {
   const blocks: TaskBlock[] = [];

   rawItems.forEach(rawItem => {
      const item = unmarshall(rawItem);
      const [type] = item.SK.split("#");
      if (type === "TEXT_BLOCK") {
         blocks.push(<TextBlock>item);
      } else if (type === "IMAGE_BLOCK") {
         blocks.push(<ImageBlock>item);
      } else if (type === "VIDEO_BLOCK") {
         blocks.push(<VideoBlock>item);
      } else if (type === "FR_BLOCK") {
         blocks.push(<FrBlock>item);
      } else if (type === "MC_BLOCK") {
         blocks.push(<McBlock>item);
      }
   });

   return blocks;
}
