import { QuizBlock } from "../interfaces/taskblock";
import { Task } from "../interfaces/taskInterfaces";
import { FreeResponseAnswer, FreeResponseAnswerInput, FreeResponseAnswerItem, MultipleChoiceAnswer, MultipleChoiceAnswerInput, MultipleChoiceAnswerItem, QuestionAnswer, QuestionAnswerItem, TaskProgress, TaskProgressInput, TaskProgressItem } from "../interfaces/taskSubmission";

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
      questionId: input.SK,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answerIndex: input.answerIndex
   }

   return questionAnswer
}

export function dbItemToFreeResponseAnswer(input: FreeResponseAnswerItem) : QuestionAnswer {
   const questionAnswer: FreeResponseAnswer = {
      username: input.PK.replace("USER#", ""),
      questionId: input.SK,
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

export function dbItemToTaskProgress(item: TaskProgressItem) : TaskProgress {
   const taskProgress: TaskProgress = {
      username: item.PK.replace("TASK_PROGRESS#", ""),
      taskId: item.SK,
      finishedRequirementIds: item.finishedRequirementIds
   }

   return taskProgress
}

export function taskRubricRequirementsComplete(task: Task, taskProgress: TaskProgress) {
   return (
      areTaskProgressIdsValid(task, taskProgress) &&
      task.requirements.length == taskProgress.finishedRequirementIds.length
   );
}

export function taskQuestionsAllAnswered(task: Task, questionProgress: QuestionAnswer[]) {
   for (var page of task.pages) {
      for (var block of page.blocks) {
         if("questions" in block) {
            for (var question of (<QuizBlock>block).questions) {
               if (!answersContainQuestionId(question.id, questionProgress)) {
                  return false
               }
            }
         }
      }
   }
   
   return true 
}

function answersContainQuestionId(questionId: string, questionProgress: QuestionAnswer[]) : boolean {
   for (var questionAnswer of questionProgress) {
      if (questionId == questionAnswer.questionId) {
         return true
      }
   }
   return false 
}



/**
 *
 * @param task The task to be compared to
 * @param taskProgress The task progress to verify
 * @returns True if the task progress is valid, false if not
 * (such as containing taskBlock ids not associated with the task)
 */
export function areTaskProgressIdsValid(task: Task, taskProgress: TaskProgressInput): boolean {
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

