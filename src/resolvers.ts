import { environment } from './environment';
import { UserResolvers} from './user-resolver';
import { CourseResolvers } from './course-resolver';
import { MissionResolvers } from './mission-resolver';
import { TaskResolvers } from './task-resolver';
import { TaskInput } from './interfaces';

//TOP LEVEL FILE FOR ALL QUERY RESOLVERS

//SEE USERS RESOLVER FOR LOGIC
const userResolvers: UserResolvers = new UserResolvers();
const courseResolvers: CourseResolvers = new CourseResolvers();
const missionResolvers: MissionResolvers = new MissionResolvers();
const taskResolvers: TaskResolvers = new TaskResolvers();


export const resolvers = {
  Query: {
    getUsers: () => userResolvers.getUsers(),
    getCourses: () => courseResolvers.getCourses(),
    getMissions: () => missionResolvers.getMissions(),
    getTasks: () => taskResolvers.getTasks()
  },
  Mutation: {
    addCourse: () => courseResolvers.addCourse(),
    addMission: () => missionResolvers.addMission(),
    addTask: (_: any, args: any) => taskResolvers.addTask(args),
  }
};