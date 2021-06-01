import { uid } from "uid";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as questionService from "../services/question";
import { TaskItem, RubricRequirementItem } from "../interfaces/task";
import { QuizBlockItem } from "../taskblock/taskblockInterface";

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
      id: taskId,
      name: input.name,
      instructions: input.instructions,
      points: input.points,
      startAt: input.startAt,
      endAt: input.endAt,
      dueDate: input.dueDate,
      pages: input.pages,
      requirements,
      course: input.course,
      missionId: input.missionId,
      missionIndex: input.missionIndex,
      subMissionId: input.subMissionId
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
      questions: questions
   };
}

/*
   item - the representation in database
   aggregate task related items () into a single task
   TaskItem, TextBlockItem, ImageBlockItem, VideoBlockItem, QuizBlockItem
*/
export async function dbItemsToTaskItem(items?: any[]): Promise<Page[]> {
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
         task.missionId = task.missionId ? task.missionId : "0";
         task.missionIndex = task.missionIndex ? task.missionIndex : 0;
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
      if(quizblock.pageIndex < pages.length) {
         pages[quizblock.pageIndex].blocks.push(quizblock);
      }
      else {
         console.log(`ERROR: Index Out Of Bounds: Quizblock PageIndex ${quizblock.pageIndex} > page length ${pages.length} in dbItemsToTaskItem`)
      }
   });

   task.pages = pages;

   return pages;
}

export function dbItemToTask(rawItem: any): Task {
   return <Task>unmarshall(rawItem); // TODO: make more explicit and write test
}

export function batchResponseToTasks(rawItems: any[]): Task[] {
   const tasks: Task[] = rawItems.map(rawItem => {
      const task = dbItemToTask(rawItem);
      return task;
   });

   return tasks;
}

const taskBusLogic = {
   applyTaskProgress,
   convertTaskInputToTaskItem
};

export default taskBusLogic;
