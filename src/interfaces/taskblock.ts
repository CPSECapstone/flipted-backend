import { CompositeDBItem } from "../services/dynamodb";

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
