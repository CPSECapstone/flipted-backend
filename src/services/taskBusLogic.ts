import { uid } from "uid";
import {
   Page,
   PageInput,
   RubricRequirement,
   Task,
   TaskBlock,
   TaskBlockInput,
   TaskInput,
   TaskProgress
} from "../interfaces/taskInterfaces";
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

/**
 * Converts a GraphQL PageInput to a GraphQL Page
 *
 * @param pageInput The page input supplied via GraphQL
 * @returns A Page that maps to the GraphQL Schema Page type
 */
function convertPageInput(pageInput: PageInput): Page {
   const blocks: any[] = [];
   for (var block of pageInput.blocks) {
      try {
         blocks.push(convertTaskBlockInput(block));
      } catch (err) {
         throw new Error("Failed to add task: Incorrect block type: " + err.message);
      }
   }

   return {
      skippable: pageInput.skippable,
      blocks: blocks
   };
}

/**
 * Converts a GraphQL TaskBlockInput to a GraphQL TaskBlock
 *
 * @param blockInput The TaskBlockInput supplied via GraphQL
 * @returns A TaskBlock that maps to the GraphQL Schema TaskBlock type
 */
function convertTaskBlockInput(blockInput: TaskBlockInput): TaskBlock {
   var specificBlock;

   switch (blockInput.type) {
      case "TEXT":
         specificBlock = {
            contents: blockInput.textBlockInput.contents,
            fontSize: blockInput.textBlockInput.fontSize
         };
         break;
      case "IMAGE":
         specificBlock = {
            imageUrl: blockInput.imageBlockInput.imageUrl
         };
         break;
      case "VIDEO":
         specificBlock = {
            videoUrl: blockInput.videoBlockInput.videoUrl
         };
         break;
      default:
         throw new Error("TaskBlockInput enum handling error");
   }

   return {
      title: blockInput.title,
      ...specificBlock
   };
}

/**
 *
 * @param input The TaskInput recieved from GraphQL
 * @returns A GraphQL Task
 */
function convertTaskInputToTask(input: TaskInput): Task {
   var convertedPages: Page[] = [];
   var convertedRequirements: RubricRequirement[] = [];

   for (var page of input.pages) {
      convertedPages.push(convertPageInput(page));
   }

   for (var requirement of input.requirements) {
      convertedRequirements.push({
         id: uid(),
         isComplete: false,
         ...requirement
      });
   }

   return {
      id: uid(),
      name: input.name,
      instructions: input.instructions,
      points: input.points,
      startAt: input.startAt,
      endAt: input.endAt,
      dueDate: input.dueDate,
      subMissionId: input.subMissionId,
      objectiveId: input.objectiveId,
      pages: convertedPages,
      requirements: convertedRequirements
   };
}

function isEligibleForSubmission(task: Task, taskProgress: TaskProgress) {
   return false;
}

const taskBusLogic = {
   areTaskProgressIdsValid,
   applyTaskProgress,
   convertTaskInputToTask,
   isEligibleForSubmission
};

export default taskBusLogic;
