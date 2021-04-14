import { Page, RubricRequirement, Task, TaskProgress } from "../interfaces/taskInterfaces";
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
   if(taskProgress.finishedBlockIds.length > ids.length) {
      return false; 
   }

   // check that each id from submission is in the task
   for (var id of taskProgress.finishedBlockIds)
   {
      if (!ids.includes(id)){
         return false
      }
   }

   return true
}

const taskBusLogic = {
   areTaskProgressIdsValid
 }

 export default taskBusLogic