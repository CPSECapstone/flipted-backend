import { MultipleChoiceQuestion } from "../interfaces";

export interface Task {
   id: string
   name: string
   points: number
   instructions: string
   startAt: Date
   endAt: Date
   dueDate: Date
   subMissionId: string
   objectiveId: string
   pages: Page[]
   requirements: RubricRequirement[]
 }
 export interface TaskInput {
   points: number
   name: string
   instructions: string
   startAt: Date
   endAt: Date
   dueDate: Date
   subMissionId: string
   objectiveId: string
   pages: PageInput[]
   requirements: RubricRequirementInput[]
 }
 
 export interface Page {
    blocks: TaskBlock[]
    skippable: Boolean
 }

 export interface TaskBlock {
   title: string
 }

 export interface ImageBlock extends TaskBlock {
   imageUrl: string
 }

 export interface VideoBlock extends TaskBlock {
   videoUrl: string
 }

 export interface TextBlock extends TaskBlock {
   contents: string
   fontSize: string
 }
 
 export interface PageInput {
    blocks: TaskBlockInput[]
    skippable: Boolean
 }
 
 export interface TaskBlockInput {
    title: string
    requirement: RubricRequirementInput
    type: string
    textBlockInput: TextBlockInput
    imageBlockInput: ImageBlockInput
    videoBlockInput: VideoBlockInput
 }
 
 export interface TextBlockInput {
    contents: string
    fontSize: number
 }
 
 export interface ImageBlockInput {
    imageUrl: string
 }
 
 export interface VideoBlockInput {
    videoUrl: string
 }
 
 export interface RubricRequirement {
   id: string
   description: string
   isComplete: boolean
}

 export interface RubricRequirementInput {
    description: string
 }

 export interface TaskProgress {
    username: string
    taskId: string
    finishedRequirementIds: string[]
 }
 