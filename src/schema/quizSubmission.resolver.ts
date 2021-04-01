import { QuizSubmissionInput } from "../interfaces";
import quizSubmissionService from "../services/quizSubmission";

async function addSubmission(_: any, args: any, context: any, info: any) {
  const submission: QuizSubmissionInput = args.submission;
  return quizSubmissionService.add(submission);
}

async function getSubmissionById(_: any, args: any, context: any, info: any) {
  const submissionId: string = args.submissionId;
  return quizSubmissionService.getById(submissionId);
}

async function listSubmissionsByQuizId(_: any, args: any, context: any) {
  const quizId: string = args.quizId;
  return quizSubmissionService.listByQuizId(quizId);
}

const resolvers = {
  Query: {
    quizSubmission: getSubmissionById,
    quizSubmissions: listSubmissionsByQuizId
  },
  Mutation: {
    addSubmission: addSubmission
  }
};

export default resolvers;
