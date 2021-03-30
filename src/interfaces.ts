export interface TaskInput {
  name: String
  description: String
  link: String
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

export interface MultipleChoiceQuestionInput {
  choices: [string]
  answer: [number]
}

export interface QuizInput {
  course: string
  name: string
  instructions: string
  totalPoints: number
  questions: [MultipleChoiceQuestionInput]
}

export interface QuizSubmissionInput {
  student: string
  quiz: string
  choices: []
}
