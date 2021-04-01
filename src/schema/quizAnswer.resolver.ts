import { Answer } from "../interfaces";
import answerService from '../services/quizAnswer';

async function addAnswer(_: any, args: any, context: any, info: any) {
  const answer: Answer = args.answer;
  return answerService.add(answer);
}

async function getAnswerById(_: any, args: any, context: any, info: any) {
  const questionId: string = args.questionId;
  return answerService.getById(questionId);
}

async function listAnswersByQuizId(_: any, args: any, context: any) {
  const quizId: string = args.quizId;
  return answerService.listByQuizId(quizId);
}

const resolvers = {
  Query: {
    quizAnswer: getAnswerById,
    quizAnswers: listAnswersByQuizId
  },
  Mutation: {
    addAnswer: addAnswer
  }
};

export default resolvers;
