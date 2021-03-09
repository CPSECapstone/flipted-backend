import { gql } from 'apollo-server-lambda';

//THIS IS AN EXAMPLE. REMOVE/ADD TYPES AS YOU SEE FIT
export const typeDefs = gql`
  type Query {
    getUsers: [User]
    getCourses: [Course]
    getMissions: [Mission]
    getTasks: [Task]
  }

  type User {
    """
    Flipted User Example
    """
    id: String!
    firstName: String!
    lastName: String!
  }

  type Course {
    """
    Course Definition
    """
    id: String!
    name: String!
    instructor: String!
    description: String!
    missions: [Mission]
  }

  type Mission {
    """
    Missions within a Course
    """
    id: String!
    name: String!
    description: String!
    tasks: [Task]
  }

  type Task {
    """
    Tasks within Missions
    """
    id: String!
    name: String!
    description: String!
    link: String
  }

  type Mutation {
    addCourse(course: CourseInput): Course 
    addMission(mission: MissionInput): Mission 
    addTask(task: TaskInput): Task
  }

  input CourseInput {
    name: String!
    instructor: String!
    description: String!
    missions: [MissionInput]
  }
  
  input MissionInput {
    name: String!
    description: String!
    tasks: [TaskInput]
  }
  
  input TaskInput {
    name: String!
    description: String!
    link: String
  }
`
//END OF EXAMPLE.