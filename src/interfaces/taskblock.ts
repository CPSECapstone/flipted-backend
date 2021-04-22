import { Question } from "./question";
import { CompositeDBItem } from "../services/dynamodb";

/***************** Input from Client *****************************/
export interface TaskBlockInput {
   taskId: string;
   title: string;
   pageIndex: number;
   blockIndex: number;
}

export interface TextBlockInput extends TaskBlockInput {
   contents: string;
   fontSize: number;
}

export interface ImageBlockInput extends TaskBlockInput {
   imageUrl: string;
}

export interface VideoBlockInput extends TaskBlockInput {
   videoUrl: string;
}

export interface QuizBlockInput extends TaskBlockInput {
   points: number;
   requiredScore: number;
   questionIds: string[];
}

/***************** Output to Client *****************************/
export interface TaskBlock {
   blockId: string;
   title: string;
   pageIndex: number;
   blockIndex: number;
}

export interface ImageBlock extends TaskBlock {
   imageUrl: string;
}

export interface VideoBlock extends TaskBlock {
   videoUrl: string;
}

export interface TextBlock extends TaskBlock {
   contents: string;
   fontSize: number;
}

export interface QuizBlock extends TaskBlock {
   points: number;
   requiredScore: number;
   questions: Question[];
}

/***************** Database item ******************************/
export declare type TaskBlockItem = TaskBlock & CompositeDBItem;
export declare type TextBlockItem = TextBlock & TaskBlockItem;
export declare type ImageBlockItem = ImageBlock & TaskBlockItem;
export declare type VideoBlockItem = VideoBlock & TaskBlockItem;

export interface QuizBlockItem extends TaskBlockItem {
   requiredScore: number;
   points: number;
   questionIds: string[];
}
