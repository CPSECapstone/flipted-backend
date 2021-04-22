import { FreeResponseAnswerInput, FreeResponseAnswerItem, MultipleChoiceAnswerInput, MultipleChoiceAnswerItem, TaskProgressInput, TaskProgressItem } from "../interfaces/taskSubmission";

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

export function multipleChoiceAnswerInputToDBItem(input: MultipleChoiceAnswerInput, username: string) : MultipleChoiceAnswerItem {
   const multipleChoiceAnswerItem: MultipleChoiceAnswerItem = {
      PK: `USER#${username}`,
      SK: input.questionId,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answerIndex: input.answerIndex
   }

   return multipleChoiceAnswerItem
}

export function freeResponseAnswerInputToDBItem(input: FreeResponseAnswerInput, username: string) : FreeResponseAnswerItem {
   const freeResponseAnswerItem: FreeResponseAnswerItem = {
      PK: `USER#${username}`,
      SK: input.questionId,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answer: input.answer
   }

   return freeResponseAnswerItem
}