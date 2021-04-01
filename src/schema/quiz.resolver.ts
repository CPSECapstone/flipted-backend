import { QuizInput } from "../interfaces";
import quizService from '../services/quiz';

async function addQuiz(_: any, args: any, context: any, info: any) {
  const quiz: QuizInput = args.quiz;
  return quizService.add(quiz);
}

async function getQuizById(_: any, args: any, context: any, info: any) {
  const quizId: string = args.quizId;
  return quizService.getById(quizId);
}

const resolvers = {
  Query: {
    quiz: getQuizById
  },
  Mutation: {
    addQuiz: addQuiz
  }
};

export default resolvers;
