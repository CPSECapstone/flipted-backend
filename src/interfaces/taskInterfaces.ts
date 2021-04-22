import { CompositeDBItem } from "../services/dynamodb";
import { TaskBlock } from "./taskblock";

/***************** Input from Client *****************************/
export interface TaskInput {
   points: number;
   name: string;
   instructions: string;
   startAt: Date;
   endAt: Date;
   dueDate: Date;
   subMissionId: string;
   objectiveId: string;
   pages: PageInput[];
   requirements: RubricRequirementInput[];
}

export interface PageInput {
   skippable: boolean;
}

export interface RubricRequirementInput {
   description: string;
}

/***************** Output to Client *****************************/
export interface Task {
   id: string;
   name: string;
   points: number;
   instructions: string;
   startAt: Date;
   endAt: Date;
   dueDate: Date;
   subMissionId: string;
   objectiveId: string;
   pages: Page[];
   requirements: RubricRequirement[];
}

export interface Page {
   skippable: boolean;
   blocks: TaskBlock[];
}

export interface RubricRequirement {
   id: string;
   description: string;
   isComplete: boolean;
}

/***************** Database item ******************************/
export interface PageItem {
   skippable: boolean;
}

export interface RubricRequirementItem {
   id: string;
   description: string;
}

export interface TaskItem extends CompositeDBItem {
   id: string;
   points: number;
   name: string;
   instructions: string;
   startAt: Date;
   endAt: Date;
   dueDate: Date;
   subMissionId: string;
   objectiveId: string;
   pages: PageItem[];
   requirements: RubricRequirementItem[];
}