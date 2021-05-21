/***************** Database item ******************************/
export declare type TaskBlockItem = TaskBlock &
   CompositeDBItem & {
      source?: string;
   };
export declare type TextBlockItem = TextBlock & TaskBlockItem;
export declare type ImageBlockItem = ImageBlock & TaskBlockItem;
export declare type VideoBlockItem = VideoBlock & TaskBlockItem;
export declare type FrBlockItem = FrBlock & TaskBlockItem;
export declare type McBlockItem = McBlock & TaskBlockItem;

export interface QuizBlockItem extends TaskBlockItem {
   requiredScore: number;
   points: number;
   questionIds: string[];
}
