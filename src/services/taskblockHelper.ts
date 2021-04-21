import { uid } from "uid/secure";

import {
   QuizBlockInput,
   TextBlockInput,
   ImageBlockInput,
   VideoBlockInput,
   TaskBlockItem,
   TextBlockItem,
   ImageBlockItem,
   VideoBlockItem,
   QuizBlockItem
} from "../interfaces/taskblock";

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
