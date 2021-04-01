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


export interface Quiz {
  id: string
  name: string
  course: string
  instructions: string
  due: Date
}
export interface QuestionOption {
  id: String
  description: String
}

export interface MultipleChoiceQuestion {
  id: string
  quizId: string
  description: string
  options: [QuestionOption]
  points: number
}

export interface MultipleChoiceQuestionInput {
  quizId: string
  description: string
  options: string[]
  answers: number[]
  points: number
}

export interface Quiz {
  id: string
  course: string
  name: string
  instructions: string
  due: Date
}
export interface QuizInput {
  course: string
  name: string
  instructions: string
  due: Date
}

export interface Answer {
  id: string
  quizId: string
  choices: string[]
}

export interface AnswerInput {
  questionId: string
  choices: string[]
}

export interface QuizSubmissionSummary {
  id: string
  quizId: string
  student: string
  points: number
  startedAt: Date
  sumbittedAt: Date
}

export interface QuizSubmission {
  submission: QuizSubmissionSummary
  quiz: Quiz
  questions: MultipleChoiceQuestion[]
  answers: Answer[]
}

export interface QuizSubmissionInput {
  student: string
  quizId: string
  answers: AnswerInput[]
}
