export interface Task {
  id: string
  name: string
  instructions: string
  startAt: Date
  endAt: Date
  dueDate: Date
  subMissionId: string
  objectiveId: string
  questions: MultipleChoiceQuestion[]
}
export interface TaskInput {
  name: string
  instructions: string
  startAt: Date
  endAt: Date
  dueDate: Date
  subMissionId: string
  objectiveId: string
}

export interface Mission {
  id: string
  course: string
  name: string
  description: string
  subMissions: SubMission[]
}
export interface MissionInput {
  course: string
  name: string
  description: string
}

export interface SubMission {
  id: string
  name: string
  description: string
  missionId: string
  objectiveId: string
  tasks: Task[]
}

export interface SubMissionInput {
  name: string
  description: string
  missionId: string
  objectiveId: string
}

export interface QuestionOption {
  id: string
  description: string
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
  dueDate: Date
}
export interface QuizInput {
  course: string
  name: string
  instructions: string
  dueDate: Date
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

export interface StudentAnswer {
  questionId: string
  points: number
  result: boolean
  choices: string[]
}

export interface QuizSubmissionSummary {
  id: string
  quizId: string
  student: string
  points: number
  startedAt: Date
  sumbittedAt: Date
  answers: StudentAnswer[]
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
export interface LearningObjective {
  id: string
  name: string
  course: string
  description: string
}
export interface LearningObjectiveInput {
  name: string
  course: string
  description: string
}

export interface CourseInput {
  name: string
  instructor: string
  description: string
}
