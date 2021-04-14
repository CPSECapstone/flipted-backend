import { Task } from "./interfaces/taskInterfaces";

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
  id: number
  description: string
}

export interface MultipleChoiceQuestion {
  id: string
  description: string
  options: QuestionOption[]
  answers: number[]
  points: number
}

export interface MultipleChoiceQuestionInput {
  description: string
  options: string[]
  answers: number[]
  points: number
}

export interface StudentAnswer {
  questionId: string
  points: number
  result: boolean
  choices: string[]
}

export interface QuizTaskSubmissionSummary {
  id: string
  taskId: string
  student: string
  points: number
  startedAt: Date
  sumbittedAt: Date
  results: StudentAnswerResult[]
}

export interface QuizTaskSubmission {
  submission: QuizTaskSubmissionSummary
  task: Task
  questions: MultipleChoiceQuestion[]
}

export interface QuizTaskSubmissionInput {
  student: string
  taskId: string
  answers: StudentAnswerInput[]
}

export interface StudentAnswerInput {
  questionId: string
  choices: number[]
}

export interface StudentAnswerResult {
  questionId: string
  result: boolean,
  points: number,
  choices: number[],
  correctChoices: number[]
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
