import { uid } from "uid";
import { Page, PageInput, RubricRequirement, Task, TaskBlockInput, TaskInput, TaskProgress } from "../interfaces/taskInterfaces";
/**
 * 
 * @param task The task to be compared to
 * @param taskProgress The task progress to verify
 * @returns True if the task progress is valid, false if not 
 * (such as containing taskBlock ids not associated with the task)
 */
function areTaskProgressIdsValid(task: Task, taskProgress: TaskProgress) : boolean {
   const ids:string[] = []
   
   // construct a list of requirement ids by extracting them from each block
   for (var page of task.pages) {
      for (var block of page.blocks) {
         const requirement: RubricRequirement = block.requirement
         ids.push(requirement.id)
      }
   }

   // check submission size is size of required task blocks or smaller
   if(taskProgress.finishedRequirementIds.length > ids.length) {
      return false; 
   }

   // check that each id from submission is in the task
   for (var id of taskProgress.finishedRequirementIds) {
      if (!ids.includes(id)){
         return false
      }
   }

   return true
}

/**
 * Modifies a teacher specified default task with any ongoing completion progress represented
 * in a TaskProgress object. Specifically, sets any RubricRequirement.isComplete to true if the
 * same id is contained within the completedBlockIds in TaskProgress.
 * 
 * @param task The task to be modified
 * @param taskProgress The task progress used to modify the task
 */
function applyTaskProgress(task: Task, taskProgress: TaskProgress) : Task
{
   for (var page of task.pages) {
      for (var block of page.blocks) {
         const requirement: RubricRequirement = block.requirement
         if(taskProgress.finishedRequirementIds.includes(requirement.id))
         {
            block.requirement.isComplete = true;
         }
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
function convertPageInput(pageInput: PageInput) : Page
{
      return {
         skippable: pageInput.skippable,
         blocks: pageInput.blocks.map((blockInput: TaskBlockInput) => {
            return convertTaskBlockInput(blockInput)
         }),
      }
}

/**
 * Converts a GraphQL TaskBlockInput to a GraphQL TaskBlock
 * 
 * @param blockInput The TaskBlockInput supplied via GraphQL
 * @returns A TaskBlock that maps to the GraphQL Schema TaskBlock type
 */
function convertTaskBlockInput(blockInput: TaskBlockInput) : any
{
   var specificBlock

   switch (blockInput.type)
   {
      case "TEXT":
         if (blockInput.textBlockInput == null) {
            return Error("Missing TextBlockInput field in TaskBlockInput.")
         }
         specificBlock = {
            contents: blockInput.textBlockInput.contents,
            fontSize: blockInput.textBlockInput.fontSize
         }
         break;
      case "IMAGE":
         if (blockInput.imageBlockInput == null) {
            return Error("Missing ImageBlockInput field in TaskBlockInput.")
         }
         specificBlock = {
            imageUrl: blockInput.imageBlockInput.imageUrl
         }
         break;
      case "VIDEO":
         if (blockInput.videoBlockInput == null) {
            return Error("Missing VideoBlockInput field in TaskBlockInput.")
         }
         specificBlock = {
            videoUrl: blockInput.videoBlockInput.videoUrl
         }
         break;
      default:
         throw new Error("TaskBlockInput enum handling error")
   }
   return {
      title: blockInput.title,
      requirement: {
         id: uid(),
         ...blockInput.requirement
      },
      ...specificBlock
   }
}

/**
 * 
 * @param input The TaskInput recieved from GraphQL
 * @returns A GraphQL Task
 */
function convertTaskInputToTask(input: TaskInput) : Task {
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
      pages: input.pages.map((element: any) => {
         return convertPageInput(element)
      }),
   }
}

const taskBusLogic = {
   areTaskProgressIdsValid,
   applyTaskProgress,
   convertTaskInputToTask
 }

 export default taskBusLogic