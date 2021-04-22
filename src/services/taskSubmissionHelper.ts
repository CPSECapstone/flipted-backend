import { FreeResponseAnswer, FreeResponseAnswerInput, FreeResponseAnswerItem, MultipleChoiceAnswer, MultipleChoiceAnswerInput, MultipleChoiceAnswerItem, QuestionAnswer, QuestionAnswerItem, TaskProgressInput, TaskProgressItem } from "../interfaces/taskSubmission";

// convert input from request to a item object that will be inserted into db
export function taskProgressInputToDBItem(input: TaskProgressInput, username: string): TaskProgressItem {

   const taskProgressItem: TaskProgressItem = {
      PK: `TASK_PROGRESS#${username}`,
      SK: input.taskId,
      finishedRequirementIds: input.finishedRequirementIds,
      username: username
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

export function dbItemToMultipleChoiceAnswer(input: MultipleChoiceAnswerItem) : QuestionAnswer {
   const questionAnswer: MultipleChoiceAnswer = {
      username: input.PK.replace("USER#", ""),
      answerId: input.SK,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answerIndex: input.answerIndex
   }

   return questionAnswer
}

export function dbItemToFreeResponseAnswer(input: FreeResponseAnswerItem) : QuestionAnswer {
   const questionAnswer: FreeResponseAnswer = {
      username: input.PK.replace("USER#", ""),
      answerId: input.SK,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answer: input.answer
   }

   return questionAnswer
}

export function dbItemsToQuestionAnswerItems(input: QuestionAnswerItem[]) : QuestionAnswer[] {
   return input.map(element => {
      if ("answerIndex" in element) {
         return dbItemToMultipleChoiceAnswer(element)
      }

      if ("answer" in element) {
         return dbItemToFreeResponseAnswer(element)
      }
      throw new Error("Type mismatch on question answer type")
   });
}
