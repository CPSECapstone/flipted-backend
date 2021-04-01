import { MultipleChoiceQuestionInput } from "../interfaces";
import questionService from '../services/quizQuestion';

async function addQuestion(_: any, args: any, context: any, info: any) {
  const question: MultipleChoiceQuestionInput = args.question;
  return questionService.add(question);
}

async function getQuestionById(_: any, args: any, context: any, info: any) {
  const questionId: string = args.questionId;
  return questionService.getById(questionId);
}

async function listQuestionsByQuizId(_: any, args: any, context: any) {
  const quizId: string = args.quizId;
  return questionService.listByQuizId(quizId);
}

const resolvers = {
  Query: {
    question: getQuestionById,
    questions: listQuestionsByQuizId
  },
  Mutation: {
    addQuestion: addQuestion
  }
};

export default resolvers;
