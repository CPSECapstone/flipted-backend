export interface TaskInput {
   name: String
   description: String
   link: [String]
}

export interface MissionInput {
   name: String
   description: String
   tasks: [TaskInput]
}

export interface CourseInput {
   name: String
   description: String
   instructor: String
   missions: [MissionInput]
}