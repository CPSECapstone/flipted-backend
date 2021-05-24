import { MasteryItem, MasteryPK, MasterySK } from "../progress/progressInterface";
import {
   FreeResponseAnswer,
   FreeResponseAnswerItem,
   MultipleChoiceAnswer,
   MultipleChoiceAnswerItem,
   Answer,
   QuestionAnswerItem,
   TaskProgressItem,
   AnswerOut,
   TaskSubmissionResultItem,
   QuestionProgress
} from "./taskSubmissionInterface";

export function createMasteryItem(
   username: string,
   course: string,
   objId: string,
   taskId: string
): MasteryItem {
   return {
      username: username,
      course: course,
      PK: MasteryPK(username),
      SK: MasterySK(objId, taskId),
      objectiveId: objId,
      taskId: taskId,
      mastery: "NEARLY_MASTERED" as Mastery
   };
}

export function taskSubResultToDBItem(
   course: string,
   missionId: string,
   input: TaskSubmissionResult,
   username: string
): TaskSubmissionResultItem {
   const output: TaskSubmissionResultItem = {
      PK: "TASK_SUBMISSION#" + username,
      SK: input.taskId,
      graded: false,
      missionId: missionId,
      course: course,
      username: username
   };

   if ('pointsAwarded' in input) {
      output.pointsAwarded = <number>input.pointsAwarded;
   }

   if ('pointsPossible' in input) {
      output.pointsPossible = <number>input.pointsPossible;
   }

   if (input.teacherComment) {
      output.teacherComment = input.teacherComment;
   }

   if (input.questionAndAnswers) {
      output.questionAndAnswers = input.questionAndAnswers;
   }

   return output;
}

export function dbItemToTaskSubmissionResult(item: TaskSubmissionResultItem): TaskSubmissionResult {
   const output: any = {
      graded: item.graded,
      pointsAwarded: item.pointsAwarded,
      pointsPossible: item.pointsPossible,
      teacherComment: item.teacherComment,
      questionAndAnswers: item.questionAndAnswers,
      taskId: item.SK
   };

   Object.keys(output).forEach(key => output[key] === undefined && delete output[key]);
   return output;
}

// convert input from request to a item object that will be inserted into db
export function taskProgressInputToDBItem(
   input: TaskProgressInput,
   username: string
): TaskProgressItem {
   const taskProgressItem: TaskProgressItem = {
      PK: `TASK_PROGRESS#${username}`,
      SK: input.taskId,
      finishedRequirementIds: input.finishedRequirementIds,
      username: username
   };

   return taskProgressItem;
}

export function multipleChoiceAnswerInputToDBItem(
   input: MultipleChoiceAnswerInput,
   username: string,
   pointsAwarded: number
): MultipleChoiceAnswerItem {
   const multipleChoiceAnswerItem: MultipleChoiceAnswerItem = {
      PK: `QUESTION_ANSWER#${username}`,
      SK: input.questionId,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answerIndex: input.answerId,
      pointsAwarded: pointsAwarded,
      graded: true
   };

   return multipleChoiceAnswerItem;
}

export function freeResponseAnswerInputToDBItem(
   input: FreeResponseAnswerInput,
   username: string
): FreeResponseAnswerItem {
   const freeResponseAnswerItem: FreeResponseAnswerItem = {
      PK: `QUESTION_ANSWER#${username}`,
      SK: input.questionId,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answer: input.answer,
      pointsAwarded: 0, // not yet graded
      graded: false // 
   };

   return freeResponseAnswerItem;
}

export function dbItemToMultipleChoiceAnswer(input: MultipleChoiceAnswerItem): Answer {
   const questionAnswer: MultipleChoiceAnswer = {
      username: input.PK.replace("QUESTION_ANSWER#", ""),
      questionId: input.SK,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answerId: input.answerIndex,
      pointsAwarded: input.pointsAwarded,
      graded: input.graded,
      teacherComment: input.teacherComment
   };

   return questionAnswer;
}

export function dbItemToFreeResponseAnswer(input: FreeResponseAnswerItem): Answer {
   const questionAnswer: FreeResponseAnswer = {
      username: input.PK.replace("QUESTION_ANSWER#", ""),
      questionId: input.SK,
      taskId: input.taskId,
      questionBlockId: input.questionBlockId,
      answer: input.answer,
      pointsAwarded: input.pointsAwarded,
      graded: input.graded,
      teacherComment: input.teacherComment
   };

   return questionAnswer;
}

export function dbItemsToQuestionAnswerItems(input: QuestionAnswerItem[]): Answer[] {
   return input.map(element => {
      if ("answerIndex" in element) {
         return dbItemToMultipleChoiceAnswer(element);
      }

      if ("answer" in element) {
         return dbItemToFreeResponseAnswer(element);
      }
      throw new Error("Type mismatch on question answer type");
   });
}

export function dbItemToTaskProgress(item: TaskProgressItem): TaskProgress {
   const taskProgress: TaskProgress = {
      username: item.PK.replace("TASK_PROGRESS#", ""),
      taskId: item.SK,
      finishedRequirementIds: item.finishedRequirementIds
   };

   return taskProgress;
}

export function taskRubricRequirementsComplete(task: Task, taskProgress: TaskProgress) {
   return (
      areTaskProgressIdsValid(task, taskProgress) &&
      task.requirements.length == taskProgress.finishedRequirementIds.length
   );
}

export function taskQuestionsAllAnswered(task: Task, questionProgress: Answer[]) {
   for (var page of task.pages) {
      for (var block of page.blocks) {
         if ("questions" in block) {
            for (var question of (<QuizBlock>block).questions) {
               if (!answersContainQuestionId(question.id, questionProgress)) {
                  return false;
               }
            }
         }
      }
   }

   return true;
}

function answersContainQuestionId(questionId: string, questionProgress: Answer[]): boolean {
   for (var questionAnswer of questionProgress) {
      if (questionAnswer.questionId.includes(questionId)) {
         return true;
      }
   }
   return false;
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

export function createTaskSubmissionResult(
   taskPointValue: number,
   taskId: string,
   questionAnswers: Answer[],
   questions: Question[],
   graded: boolean
): TaskSubmissionResult {
   const submissionResult: TaskSubmissionResult = {
      graded: graded, // TODO "auto graded" setting in task should modify this
      pointsAwarded: questionAnswers.reduce((a, b) => a + b.pointsAwarded, 0),
      pointsPossible: taskPointValue,
      taskId: taskId,
      questionAndAnswers: associateQuestionWithAnswers(questions, questionAnswers)
   };

   return submissionResult;
}

export function associateQuestionWithAnswers(
   questions: Question[],
   questionAnswers: Answer[]
): QuestionAndAnswer[] {
   const gradedAnswer: QuestionAndAnswer[] = [];

   for (var answer of questionAnswers) {
      gradedAnswer.push(createQuestionAnswerUnion(answer, questions));
   }

   return gradedAnswer;
}

export function answerToAnswerOut(answer: Answer): AnswerOut {
   var answerOut: AnswerOut;
   if ("answer" in <any>answer) {
      answerOut = {
         questionId: answer.questionId,
         answer: (<any>answer).answer,
         pointsAwarded: answer.pointsAwarded,
         graded: answer.graded,
         teacherComment: answer.teacherComment
      };
   } else {
      answerOut = {
         questionId: answer.questionId,
         answer: String((<any>answer).answerId),
         pointsAwarded: answer.pointsAwarded,
         graded: answer.graded,
         teacherComment: answer.teacherComment
      };
   }
   return answerOut;
}

export function createQuestionProgressOutput(taskId: string, answers: Answer[]): QuestionProgress {
   return {
      taskId: taskId,
      answers: answers.map(answer => {
         const answerOut = answerToAnswerOut(answer);

         // dont want students getting their grade before task is submitted
         answerOut.pointsAwarded = undefined;

         return answerOut;
      })
   };
}

/** Need a function to find the associated question with an answer since mapping can't be garunteed */
function createQuestionAnswerUnion(answer: Answer, questions: Question[]): QuestionAndAnswer {
   for (var question of questions) {
      if (answer.questionId.includes(question.id)) {
         const out: QuestionAndAnswer = {
            question: question,
            answer: answerToAnswerOut(answer)
         };

         return out;
      }
   }

   throw new Error("Question associated with answer not found");
}
