import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { GraphQLDateTime } from 'graphql-iso-date';

import customType from './custom.graphql';
import userType from './user.graphql';
import missionType from './mission.graphql';
import courseType from './course.graphql';
import taskType from './task.graphql';
import quizType from './quiz.graphql';

import userResolvers from './user.resolver';
import courseResolvers from './course.resolver';
import taskResolvers from './task.resolver';
import missionResolvers from './mission.resolver';
import quizResolvers from './quiz.resolver';
import quizQuestionResolvers from './quizQuestion.resolver';
import quizAnswerResolvers from './quizAnswer.resolver';
import quizSubmissionResolvers from './quizSubmission.resolver';

const customScalarResolver = {
  Date: GraphQLDateTime
}

const typesArray = [
  customType,
  userType,
  missionType,
  courseType,
  taskType,
  quizType
];

const resolversArray = [
  customScalarResolver,
  userResolvers,
  courseResolvers,
  taskResolvers,
  missionResolvers,
  quizResolvers,
  quizQuestionResolvers,
  quizAnswerResolvers,
  quizSubmissionResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
