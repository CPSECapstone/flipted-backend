import { Answer, TaskSubmissionResult } from "./taskSubmissionInterface";
import { validateToken } from "../jws-verifer";
import * as questionService from "../services/question";
import {
   gradeMultipleChoiceQuestion,
   isValidMultipleChoiceAnswer,
   quizBlockContainsQuestionIdWithPrefix
} from "../services/questionHelper";
import taskService from "../services/task";
import taskSubmissionService from "./taskSubmission";
import {
   areTaskProgressIdsValid,
   freeResponseAnswerInputToDBItem,
   multipleChoiceAnswerInputToDBItem,
   taskRubricRequirementsComplete,
   taskProgressInputToDBItem,
   taskQuestionsAllAnswered,
   createTaskSubmissionResult,
   createQuestionProgressOutput
} from "./taskSubmissionHelper";
import quizblockService from "../services/taskblock";

async function submitMultChoiceQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const mcAnswerInput: MultipleChoiceAnswerInput = args.mcBlockInput;

   const question: McQuestion = <McQuestion>(
      await questionService.getById(mcAnswerInput.questionId, "")
   );

   // this asserts both the existence of the task, and the quizblock being within that task
   const quizBlock: QuizBlock = await quizblockService.getQuizBlockById(
      mcAnswerInput.taskId,
      mcAnswerInput.questionBlockId
   );

   if (!quizBlockContainsQuestionIdWithPrefix(quizBlock, mcAnswerInput.questionId, "MC_QUESTION")) {
      throw new Error(
         "Provided multiple choice question could not be found in the provided quiz block"
      );
   }

   if (!isValidMultipleChoiceAnswer(question, mcAnswerInput.answerId)) {
      throw new Error("Provided answer id not a choice for this multiple choice question");
   }

   // grade the question against the students answer
   const pointsAwarded: number = gradeMultipleChoiceQuestion(question, mcAnswerInput.answerId);

   // store the grade for that quiz block and associate with the user
   taskSubmissionService.submitQuestionAnswer(
      multipleChoiceAnswerInputToDBItem(mcAnswerInput, tokenPayload.username, pointsAwarded)
   );

   return true;
}

async function submitFreeResponseQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const frAnswerInput: FreeResponseAnswerInput = args.frBlockInput;

   // get the question as defined by the database
   const question: FrQuestion = <FrQuestion>(
      await questionService.getById(frAnswerInput.questionId, "")
   );

   if (!question.id) {
      throw new Error("Could not find question with id: " + frAnswerInput.questionId);
   }

   // this asserts both the existence of the task, and the quizblock being within that task
   const quizBlock: QuizBlock = await quizblockService.getQuizBlockById(
      frAnswerInput.taskId,
      frAnswerInput.questionBlockId
   );

   if (!quizBlockContainsQuestionIdWithPrefix(quizBlock, frAnswerInput.questionId, "FR_QUESTION")) {
      throw new Error(
         "Provided free response question could not be found in the provided quiz block"
      );
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
   if (areTaskProgressIdsValid(task, taskProgInput)) {
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

   // Get all submitted answers to the questions in this task by the user from the db
   const questionAnswers: Answer[] = await taskSubmissionService.getQuizProgressForTask(
      taskId,
      username
   );

   // Get the rubric progress of the student fromt the db
   const taskProgress: TaskProgress = await taskSubmissionService.getTaskRubricProgress(
      taskId,
      username
   );

   if (!taskRubricRequirementsComplete(task, taskProgress)) {
      throw new Error("Task is ineligible for submission. Not all rubric requirements checked.");
   }

   if (!taskQuestionsAllAnswered(task, questionAnswers)) {
      throw new Error("Task is ineligible for submission. Not all quiz questions answered.");
   }

   // Get all questions associated with the task (at this point, all questions were answered)
   const questions: Question[] = await questionService.listByIds(
      questionAnswers.map(qa => {
         return qa.questionId;
      }),
      true
   );

   // use the task, all questions, and all question answers to construct TaskSubmissionResult
   const taskSubmissionResult: TaskSubmissionResult = createTaskSubmissionResult(
      task.points,
      task.id,
      questionAnswers,
      questions
   );

   // save the constructed submission to the database for grading and retrieval
   taskSubmissionService.submitTaskForGrading(task, taskSubmissionResult, username);

   // return to user
   return taskSubmissionResult;
}

async function retrieveTaskSubmission(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;

   try {
      const taskSubmission = await taskSubmissionService.getTaskSubmission(username, args.taskId);
      return taskSubmission;
   } catch (err) {
      // don't error: just return null if it doesn't exist
      return null;
   }
}

async function retrieveTaskProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;

   try {
      const taskProgress = await taskSubmissionService.getTaskRubricProgress(args.taskId, username);
      return taskProgress;
   } catch (err) {
      // don't error: just return null if it doesn't exist
      return null;
   }
}

async function retrieveQuestionProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const username: string = tokenPayload.username;

   const answers = await taskSubmissionService.getQuizProgressForTask(args.taskId, username);
   return createQuestionProgressOutput(args.taskId, answers);
}

const resolvers = {
   Query: {
      retrieveTaskSubmission: retrieveTaskSubmission,
      retrieveTaskProgress: retrieveTaskProgress,
      retrieveQuestionProgress: retrieveQuestionProgress
   },
   Mutation: {
      saveMultipleChoiceProgress: submitMultChoiceQuestion,
      saveFreeResponseProgress: submitFreeResponseQuestion,
      submitTaskProgress: submitTaskRubricProgress,
      submitTask: submitTask
   }
};

export default resolvers;
