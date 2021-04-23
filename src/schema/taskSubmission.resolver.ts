import { FRQuestion, MCQuestion } from "../interfaces/question";
import {
   FreeResponseAnswerInput,
   MultipleChoiceAnswerInput,
   QuestionAnswer,
   QuestionAnswerItem,
   TaskProgress,
   TaskProgressInput,
   TaskProgressItem
} from "../interfaces/taskSubmission";
import { Task } from "../interfaces/taskInterfaces";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import { gradeMultipleChoiceQuestion } from "../services/questionHelper";
import taskService from "../services/task";
import taskBusLogic from "../services/taskBusLogic";
import taskSubmissionService from "../services/taskSubmission";
import { freeResponseAnswerInputToDBItem, multipleChoiceAnswerInputToDBItem, taskProgressInputToDBItem } from "../services/taskSubmissionHelper";

async function submitMultChoiceQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const mcAnswerInput: MultipleChoiceAnswerInput = args.mcBlockInput;

   // TODO: Assert given question id is contained in given quizblock
   // TODO: Assert given block id is contained in given task
   // TODO: Assert given task id exists

   // get the question as defined by the database
   const question: MCQuestion = <MCQuestion>(
      await questionService.getById(mcAnswerInput.questionId)
   );

   if (!question.id) {
      throw new Error("Could not find question with id: " + mcAnswerInput.questionId);
   }

   // grade the question against the students answer
   const pointsAwarded: number = gradeMultipleChoiceQuestion(question, mcAnswerInput.answerIndex);

   // store the grade for that quiz block and associate with the user
   taskSubmissionService.submitQuestionAnswer(
      multipleChoiceAnswerInputToDBItem(mcAnswerInput, tokenPayload.username)
   );

   return true;
}

async function submitFreeResponseQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const frAnswerInput: FreeResponseAnswerInput = args.frBlockInput;

   // TODO: Assert given question id is contained in given quizblock
   // TODO: Assert given block id is contained in given task
   // TODO: Assert given task id exists

   // get the question as defined by the database
   const question: FRQuestion = <FRQuestion>(
      (<unknown>await questionService.getById(frAnswerInput.questionId))
   );

   if (!question.id) {
      throw new Error("Could not find question with id: " + frAnswerInput.questionId);
   }

   // store the grade for that quiz block and associate with the user
   taskSubmissionService.submitQuestionAnswer(
     freeResponseAnswerInputToDBItem(frAnswerInput, tokenPayload.username)
   );

   return true;
}

async function submitTaskRubricProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const taskProgInput: TaskProgressInput = args.taskProgress;

   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getTaskById(taskProgInput.taskId);
   if (taskBusLogic.areTaskProgressIdsValid(task, taskProgInput)) {
      const taskItem = taskProgressInputToDBItem(taskProgInput, tokenPayload.username);
      taskSubmissionService.submitTaskProgress(taskItem);
      return true;
   }

   return Error("Failed to verify ids contained in task submission");
}

async function submitTask(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;
   const taskId: string = args.taskId;
   const task: Task = await taskService.getTaskById(taskId);

   // This should fail if no task progress has been recorded
   const questionAnswers: QuestionAnswer[] = await taskSubmissionService.getQuizProgressForTask(taskId, username)
   const taskProgress: TaskProgress = await taskSubmissionService.getTaskRubricProgress(taskId, username);

   const questionProgress = 

   // Verify that all rubric requirements are complete
   if (taskBusLogic.isEligibleForSubmission(task, taskProgress, questionProgress)) {
      // create task submission
      
      taskSubmissionService.creat
      return taskSubmissionService.submitTask(username, taskId);
   } else {
     throw new Error("Task is ineligible for submission. Not all requirements complete");
  }
}

async function retrieveTaskSubmission(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;

   const taskSubmission = await taskSubmissionService.getTaskSubmission(args.taskId, username);
   return taskSubmission;
}

const resolvers = {
   Query: {
      retrieveTaskSubmission: retrieveTaskSubmission
   },
   Mutation: {
      saveMultipleChoiceProgress: submitMultChoiceQuestion,
      saveFreeResponseProgress: submitFreeResponseQuestion,
      submitTaskProgress: submitTaskRubricProgress,
      submitTask: submitTask
   }
};

export default resolvers;
