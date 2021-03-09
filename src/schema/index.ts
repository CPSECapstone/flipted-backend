import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import userType from './user.graphql';
import missionType from './mission.graphql';
import courseType from './course.graphql';
import taskType from './task.graphql';

import userResolvers from './user.resolver';
import courseResolvers from './course.resolver';
import taskResolvers from './task.resolver';
import missionResolvers from './mission.resolver';

const typesArray = [
  userType,
  missionType,
  courseType,
  taskType
];

const resolversArray = [
  userResolvers,
  courseResolvers,
  taskResolvers,
  missionResolvers
];

export const typeDefs = mergeTypeDefs(typesArray);
export const resolvers = mergeResolvers(resolversArray);
