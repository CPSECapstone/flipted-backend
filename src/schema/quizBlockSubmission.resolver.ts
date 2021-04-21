import { MCQuestion } from "../interfaces/question";
import { QuizBlock } from "../interfaces/quizblock";
import { MultipleChoiceBlockSubmission } from "../interfaces/quizBlockSubmission";
import { validateToken } from "../jws-verifer";
import questionService from "../services/question";
import { gradeMultipleChoiceQuestion } from "../services/questionHelper";
import quizblockService from "../services/quizblock";

async function submitMultChoiceBlock(_: any, args: any, context: any) {
   const tokenPayload = await validateToken(context.headers.Authorization);

   const blockSubmission: MultipleChoiceBlockSubmission = args.mcBlockInput;

   // get the correct quiz answer index
   const quizBlock: QuizBlock = await quizblockService.getQuizBlockById(
      blockSubmission.taskId,
      blockSubmission.questionBlockId
   );
   const questionsArray = await questionService.listByIds([blockSubmission.questionId]);
   const question: MCQuestion = <MCQuestion>questionsArray[0]
   
   // grade the question
   const pointsAwarded: number = gradeMultipleChoiceQuestion(
      question,
      blockSubmission.answerIndex,
   );

   // grade the quiz block

   // store the grade for that quiz block and associate with the user
   return Error("Failed to finish writing this function");
}

async function submitFreeResponseBlock(_: any, args: any, context: any) {}

const resolvers = {
   Query: {},
   Mutation: {
      submitMultChoiceBlock: submitMultChoiceBlock,
      submitFreeResponseBlock: submitFreeResponseBlock
   }
};

export default resolvers;
