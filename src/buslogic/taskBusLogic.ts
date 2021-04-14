import { Page, RubricRequirement, Task, TaskProgress } from "../interfaces/taskInterfaces";
/**
 * 
 * @param task The task to be compared to
 * @param taskProgress The task progress to verify
 * @returns True if the task progress is valid, false if not 
 * (such as containing taskBlock ids not associated with the task)
 */
function areTaskProgressIdsValid(task: Task, taskProgress: TaskProgress) : boolean {
   for (var page of task.pages) {
      for (var block of page.blocks) {
         const requirement: RubricRequirement = block.requirement
         if (!taskProgress.finishedBlockIds.includes(block.requirement.id)){
            return false
         }
      }
   }

   return true
}

const taskBusLogic = {
   areTaskProgressIdsValid
 }

 export default taskBusLogic