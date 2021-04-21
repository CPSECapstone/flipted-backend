import { MCQuestion } from "../interfaces/question";
import { QuizBlock } from "../interfaces/quizblock";
import { MultipleChoiceBlockSubmission } from "../interfaces/quizBlockSubmission";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import { gradeMultipleChoiceQuestion } from "../services/questionHelper";
import quizblockService from "../services/quizblock";
import quizBlockSubmissionService from "../services/quizBlockSubmission";

async function submitMultChoiceQuestion(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const blockSubmission: MultipleChoiceBlockSubmission = args.mcBlockInput;
   // TODO: Assert question contained in block and block contained in task?
   // get the question as defined by the database
   const questionsArray = await questionService.listByIds([blockSubmission.questionId]);
   const question: MCQuestion = <MCQuestion>questionsArray[0];
   console.log(question);

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

async function submitFreeResponseBlock(_: any, args: any, context: any) {}

const resolvers = {
   Query: {},
   Mutation: {
      submitMultChoiceQuestion: submitMultChoiceQuestion,
      submitFreeResponseBlock: submitFreeResponseBlock
   }
};

export default resolvers;
