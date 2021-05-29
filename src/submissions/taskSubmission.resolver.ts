import { Answer} from "./taskSubmissionInterface";
import { validateToken } from "../jws-verifer";
import * as questionService from "../services/question";
import {
   gradeMultipleChoiceQuestion,
   isValidMultipleChoiceAnswer,
   quizBlockContainsQuestionIdWithPrefix
} from "../services/questionHelper";
import taskService from "../task/task.service";
import taskSubmissionService from "./taskSubmission";
import {
   areTaskProgressIdsValid,
   freeResponseAnswerInputToDBItem,
   multipleChoiceAnswerInputToDBItem,
   taskRubricRequirementsComplete,
   taskProgressInputToDBItem,
   taskQuestionsAllAnswered,
   createTaskSubmissionResult,
   createQuestionProgressOutput,
   associateQuestionWithAnswers
} from "./taskSubmissionHelper";
import * as taskblockService from "../taskblock/taskblockService";
import { Resolvers } from "../__generated__/resolvers";
import { RoleInternal } from "../interfaces/role";

async function submitMultChoiceQuestion(_: any, args: any, context: FliptedContext) {
   const mcAnswerInput: MultipleChoiceAnswerInput = args.mcBlockInput;

   const question: McQuestion = <McQuestion>(
      await questionService.getById(mcAnswerInput.questionId, "")
   );

   // this asserts both the existence of the task, and the quizblock being within that task
   const quizBlock: QuizBlock = await taskblockService.getQuizBlockById(
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
      multipleChoiceAnswerInputToDBItem(mcAnswerInput, context.username, pointsAwarded)
   );

   return true;
}

async function submitFreeResponseQuestion(_: any, args: any, context: FliptedContext) {
   const frAnswerInput: FreeResponseAnswerInput = args.frBlockInput;

   // get the question as defined by the database
   const question: FrQuestion = <FrQuestion>(
      await questionService.getById(frAnswerInput.questionId, "")
   );

   if (!question.id) {
      throw new Error("Could not find question with id: " + frAnswerInput.questionId);
   }

   // this asserts both the existence of the task, and the quizblock being within that task
   const quizBlock: QuizBlock = await taskblockService.getQuizBlockById(
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
      freeResponseAnswerInputToDBItem(frAnswerInput, context.username)
   );

   return true;
}

async function submitTaskRubricProgress(_: any, args: MutationSubmitTaskProgressArgs, context: FliptedContext, info: any) {
   const taskProgInput: TaskProgressInput = args.taskProgress;

   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getTaskInfoById(taskProgInput.taskId);
   console.log(task)
   if (areTaskProgressIdsValid(task, taskProgInput)) {
      const taskItem = taskProgressInputToDBItem(taskProgInput, context.username);
      taskSubmissionService.submitTaskProgress(taskItem);
      return "success";
   }

   throw new Error("Failed to verify ids contained in task submission");
}

async function submitTask(_: any, args: any, context: FliptedContext, info: any) {
   const username: string = context.username;
   const taskId: string = args.taskId;
   const task: Task = await taskService.getFullTaskById(taskId);

   // Get all submitted answers to the questions in this task by the user from the db
   const questionAnswers: Answer[] = await taskSubmissionService.getQuizProgressForTask(
      taskId,
      username
   );

   if ( task.requirements.length > 0) {
      const taskProgress: TaskProgress = await taskSubmissionService.getTaskRubricProgress(
         taskId,
         username
      );

      if (!taskRubricRequirementsComplete(task, taskProgress)) {
         throw new Error("Task is ineligible for submission. Not all rubric requirements checked.");
      }
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
      questions,
      false
   );

   taskSubmissionService.generateMasteryItemsForTask(username, task.id, task.course);

   // save the constructed submission to the database for grading and retrieval
   taskSubmissionService.submitTaskForGrading(task, taskSubmissionResult, username);

   const questionAndAnswers = associateQuestionWithAnswers(questions, questionAnswers);
   // return to user
   return {
      questionAndAnswers: questionAndAnswers,
      ...taskSubmissionResult
   };
}

async function retrieveTaskSubmission(
   _: any,
   args: QueryRetrieveTaskSubmissionArgs,
   context: FliptedContext,
   info: any
): Promise<TaskSubmissionResult> {
   const username: string = context.userRole == RoleInternal.Instructor && args.username ? args.username : context.username

   try {
      // Get all submitted answers to the questions in this task by the user from the db
      const questionAnswers: Answer[] = await taskSubmissionService.getQuizProgressForTask(
         args.taskId,
         username
      );

      // Get all questions associated with the task
      const questions: Question[] = await questionService.listByIds(
         questionAnswers.map(qa => {
            return qa.questionId;
         }),
         true
      );

      const taskSubmission = await taskSubmissionService.getTaskSubmission(username, args.taskId);
      const questionAndAnswers = associateQuestionWithAnswers(questions, questionAnswers);

      // only factor in teacher awarded free points if full task is graded
      // otherwise it will duplicate add automatically generated scores
      const pointAwarded =
         questionAnswers.reduce((a, b) => a + b.pointsAwarded, 0) +
         (taskSubmission.graded && taskSubmission.pointsAwarded ? taskSubmission.pointsAwarded : 0);

      return {
         questionAndAnswers: questionAndAnswers,
         pointsAwarded: pointAwarded,
         pointsPossible: taskSubmission.pointsPossible,
         teacherComment: taskSubmission.teacherComment,
         taskId: taskSubmission.taskId,
         graded: taskSubmission.graded
      };
   } catch (err) {
      throw err;
   }
}

async function retrieveTaskProgress(_: any, args: any, context: FliptedContext, info: any) {
   const username: string = context.username;

   try {
      const taskProgress = await taskSubmissionService.getTaskRubricProgress(args.taskId, username);
      return taskProgress;
   } catch (err) {
      // don't error: just return null if it doesn't exist
      return null;
   }
}

async function retrieveQuestionProgress(_: any, args: any, context: FliptedContext, info: any) {
   const username: string = context.username;

   const answers = await taskSubmissionService.getQuizProgressForTask(args.taskId, username);
   return createQuestionProgressOutput(args.taskId, answers);
}

const resolvers: Resolvers = {
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
