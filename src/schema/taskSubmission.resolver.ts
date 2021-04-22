import { FRQuestion, MCQuestion } from "../interfaces/question";
import { FreeResponseBlockSubmission, MultipleChoiceBlockSubmission } from "../interfaces/quizBlockSubmission";
import { Task, TaskProgress, TaskProgressInput } from "../interfaces/taskInterfaces";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import { gradeMultipleChoiceQuestion } from "../services/questionHelper";
import taskService from "../services/task";
import taskBusLogic from "../services/taskBusLogic";
import taskSubmissionService from "../services/taskSubmission";
import { taskProgressInputToDBItem } from "../services/taskSubmissionHelper";

async function submitMultChoiceQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const blockSubmission: MultipleChoiceBlockSubmission = args.mcBlockInput;
   
   // TODO: Assert given question id is contained in given quizblock
   // TODO: Assert given block id is contained in given task
   // TODO: Assert given task id exists

   // get the question as defined by the database
   const question: MCQuestion = <MCQuestion>(await questionService.getById(blockSubmission.questionId));
   
   if (!question.id) {
      throw new Error("Could not find question with id: " + blockSubmission.questionId)
   } 

   // grade the question against the students answer
   const pointsAwarded: number = gradeMultipleChoiceQuestion(question, blockSubmission.answerIndex);

   // store the grade for that quiz block and associate with the user
   taskSubmissionService.submitMCQuestion(
      tokenPayload.username,
      blockSubmission.taskId,
      blockSubmission.questionBlockId,
      question.id,
      pointsAwarded
   );

   return true;
}

async function submitFreeResponseQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const blockSubmission: FreeResponseBlockSubmission = args.frBlockInput;

   // TODO: Assert given question id is contained in given quizblock
   // TODO: Assert given block id is contained in given task
   // TODO: Assert given task id exists

    // get the question as defined by the database
   const question: FRQuestion = <FRQuestion>(await questionService.getById(blockSubmission.questionId));

   if (!question.id) {
      throw new Error("Could not find question with id: " + blockSubmission.questionId)
   } 

    // store the grade for that quiz block and associate with the user
    taskSubmissionService.submitFRQuestion(
      tokenPayload.username,
      blockSubmission.taskId,
      blockSubmission.questionBlockId,
      question.id,
      blockSubmission.answer
   );


   return true
}

async function submitTaskRubricProgress(_: any, args: any, context: any, info: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);
   const taskProgInput: TaskProgressInput = args.taskProgress
    
   // verify that the list of completed requirement ids exist in the task
   const task: Task = await taskService.getTaskById(taskProgInput.taskId);
   if (taskBusLogic.areTaskProgressIdsValid(task, taskProgInput)) {
      const taskItem = taskProgressInputToDBItem(taskProgInput, tokenPayload.username)
      taskSubmissionService.submitTaskProgress(taskItem);
      return true
   }

   return Error("Failed to verify ids contained in task submission");
}

const resolvers = {
   Query: {},
   Mutation: {
      saveMultipleChoiceProgress: submitMultChoiceQuestion,
      saveFreeResponseProgress: submitFreeResponseQuestion,
      submitTaskProgress: submitTaskRubricProgress
   }
};

export default resolvers;
