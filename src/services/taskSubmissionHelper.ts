import { TaskProgressInput, TaskProgressItem } from "../interfaces/taskSubmission";

// convert input from request to a item object that will be inserted into db
export function taskProgressInputToDBItem(input: TaskProgressInput, username: string): TaskProgressItem {

   const taskProgressItem: TaskProgressItem = {
      PK: `TASK_PROGRESS#${username}`,
      SK: input.taskId,
      username: username,
      finishedRequirementIds: input.finishedRequirementIds

   };

   return taskProgressItem;
}