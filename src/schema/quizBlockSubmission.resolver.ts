import { assert } from "chai";
import { FRQuestion, MCQuestion } from "../interfaces/question";
import { QuizBlock } from "../interfaces/quizblock";
import { FreeResponseBlockSubmission, MultipleChoiceBlockSubmission } from "../interfaces/quizBlockSubmission";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import { gradeMultipleChoiceQuestion } from "../services/questionHelper";
import quizblockService from "../services/quizblock";
import quizBlockSubmissionService from "../services/quizBlockSubmission";

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
   quizBlockSubmissionService.submitMCQuestion(
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
    quizBlockSubmissionService.submitFRQuestion(
      tokenPayload.username,
      blockSubmission.taskId,
      blockSubmission.questionBlockId,
      question.id,
      blockSubmission.answer
   );


   return true
}

const resolvers = {
   Query: {},
   Mutation: {
      saveMultipleChoiceProgress: submitMultChoiceQuestion,
      saveFreeResponseProgress: submitFreeResponseQuestion
   }
};

export default resolvers;
