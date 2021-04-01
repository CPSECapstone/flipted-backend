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
  quizId: string
  description: string
  options: string[]
  answers: number[]
  points: number
}

export interface QuizInput {
  course: string
  name: string
  instructions: string
  due: Date
}

export interface AnswerInput {
  id: string
  quizId: string
  choices: string[]
}

export interface QuizSubmissionInput {
  student: string
  quizId: string
  answers: AnswerInput[]
}
