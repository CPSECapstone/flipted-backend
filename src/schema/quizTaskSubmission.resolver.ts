import { QuizTaskSubmissionInput } from "../interfaces";
import quizTaskSubmissionService from "../services/quizTaskSubmission";

async function addSubmission(_: any, args: any, context: any, info: any) {
  const submission: QuizTaskSubmissionInput = args.submission;
  return quizTaskSubmissionService.add(submission);
}

async function getSubmissionById(_: any, args: any, context: any, info: any) {
  const submissionId: string = args.submissionId;
  return quizTaskSubmissionService.getById(submissionId);
}

async function listSubmissionsByTaskId(_: any, args: any, context: any) {
  const taskId: string = args.taskId;
  return quizTaskSubmissionService.listByTaskId(taskId);
}

const resolvers = {
  Query: {
    quizSubmission: getSubmissionById,
    quizSubmissions: listSubmissionsByTaskId
  },
  Mutation: {
    addSubmission: addSubmission
  }
};

export default resolvers;
