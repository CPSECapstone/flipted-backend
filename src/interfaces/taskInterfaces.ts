import { MultipleChoiceQuestion } from "../interfaces";

export interface Task {
   id: string
   name: string
   instructions: string
   startAt: Date
   endAt: Date
   dueDate: Date
   subMissionId: string
   objectiveId: string
   pages: Page[]
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
 }
 
 export interface Page {
    blocks: any[]
    skippable: Boolean
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
 
 export interface RubricRequirementInput {
    description: String
    isComplete: Boolean
 }
 