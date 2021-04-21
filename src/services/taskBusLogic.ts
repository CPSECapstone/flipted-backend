import { uid } from "uid";
import { CompositeDBItem } from "./dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import questionService from "./question";
import {
   Task,
   TaskInput,
   TaskProgress,
   RubricRequirementInput,
   Page
} from "../interfaces/taskInterfaces";
import {
   QuizBlockInput,
   TextBlockInput,
   ImageBlockInput,
   VideoBlockInput,
   TaskBlockItem,
   TextBlockItem,
   ImageBlockItem,
   VideoBlockItem,
   QuizBlockItem,
   ImageBlock,
   QuizBlock,
   TaskBlock,
   TextBlock,
   VideoBlock
} from "../interfaces/taskblock";

/**
 *
 * @param task The task to be compared to
 * @param taskProgress The task progress to verify
 * @returns True if the task progress is valid, false if not
 * (such as containing taskBlock ids not associated with the task)
 */
function areTaskProgressIdsValid(task: Task, taskProgress: TaskProgress): boolean {
   const ids: string[] = [];

   // construct a list of requirement ids by extracting them from each block
   for (var requirement of task.requirements) {
      ids.push(requirement.id);
   }

   // check submission size is size of required task blocks or smaller
   if (taskProgress.finishedRequirementIds.length > ids.length) {
      return false;
   }

   // check that each id from submission is in the task
   for (var id of taskProgress.finishedRequirementIds) {
      if (!ids.includes(id)) {
         return false;
      }
   }

   return true;
}

/**
 * Modifies a teacher specified default task with any ongoing completion progress represented
 * in a TaskProgress object. Specifically, sets any RubricRequirement.isComplete to true if the
 * same id is contained within the completedBlockIds in TaskProgress.
 *
 * @param task The task to be modified
 * @param taskProgress The task progress used to modify the task
 */
function applyTaskProgress(task: Task, taskProgress: TaskProgress): Task {
   for (var requirement of task.requirements) {
      if (taskProgress.finishedRequirementIds.includes(requirement.id)) {
         requirement.isComplete = true;
      }
   }

   return task;
}

interface PageItem {
   skippable: boolean;
}

interface RubricRequirementItem {
   id: string;
   description: string;
}

export interface TaskItem extends CompositeDBItem {
   points: number;
   name: string;
   instructions: string;
   startAt: Date;
   endAt: Date;
   dueDate: Date;
   subMissionId: string;
   objectiveId: string;
   pages: PageItem[];
   requirements: RubricRequirementItem[];
}

/**
 *
 * @param input The TaskInput recieved from GraphQL
 * @returns A GraphQL Task
 */
function convertTaskInputToTaskItem(input: TaskInput): TaskItem {
   const taskId = uid();
   const requirements = input.requirements.map((requirement: RubricRequirementInput) => {
      return <RubricRequirementItem>{
         id: uid(),
         description: requirement.description
      };
   });

   const taskItem = <TaskItem>{
      PK: `TASK#${taskId}`,
      SK: `TASK#${taskId}`,
      name: input.name,
      instructions: input.instructions,
      points: input.points,
      startAt: input.startAt,
      endAt: input.endAt,
      dueDate: input.dueDate,
      subMissionId: input.subMissionId,
      objectiveId: input.objectiveId,
      pages: input.pages,
      requirements
   };

   return taskItem;
}

async function dbItemToQuizBlock(item: QuizBlockItem): Promise<QuizBlock> {
   const questions = await questionService.listByIds(item.questionIds);
   const [_, blockId] = item.SK.split("#");

   return <QuizBlock>{
      blockId,
      title: item.title,
      pageIndex: item.pageIndex,
      blockIndex: item.blockIndex,
      points: item.points,
      requiredScore: item.requiredScore,
      questions
   };
}

/*
   item - the representation in database
   aggregate task related items () into a single task
   TaskItem, TextBlockItem, ImageBlockItem, VideoBlockItem, QuizBlockItem
*/
export async function dbItemsToTaskItem(items?: any[]): Promise<Task> {
   let task: Task | undefined;
   let blocks: TaskBlock[] = [];
   let promises: Promise<QuizBlock>[] = []; // promises to get questions

   if (!items) {
      throw new Error("Task Not Found");
   }

   items.forEach((rawItem: any) => {
      const item = unmarshall(rawItem);
      const [type, id] = item.SK.split("#");

      if (type === "TASK") {
         task = <Task>item;
      } else if (type == "IMAGE_BLOCK") {
         blocks.push(<ImageBlock>item);
      } else if (type == "VIDEO_BLOCK") {
         blocks.push(<VideoBlock>item);
      } else if (type == "TEXT_BLOCK") {
         blocks.push(<TextBlock>item);
      } else if (type == "QUIZ_BLOCK") {
         const quizblock = <QuizBlockItem>item;
         promises.push(dbItemToQuizBlock(quizblock));
      }
   });

   if (!task) {
      throw new Error("Task Not Found");
   }

   let quizblocks = await Promise.all(promises);
   blocks = blocks.concat(quizblocks);
   blocks.sort((a, b) => a.blockIndex - b.blockIndex);

   let pages: Page[] = task.pages.map(page => {
      return {
         skippable: page.skippable,
         blocks: []
      };
   });
   blocks.forEach(quizblock => {
      pages[quizblock.pageIndex].blocks.push(quizblock);
   });

   task.pages = pages;

   return task;
}

const taskBusLogic = {
   areTaskProgressIdsValid,
   applyTaskProgress,
   convertTaskInputToTaskItem
};

export default taskBusLogic;
