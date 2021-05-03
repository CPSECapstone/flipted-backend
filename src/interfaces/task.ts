import { CompositeDBItem } from "../services/dynamodb";

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
   parentMissionId: string;
   parentMissionIndex: number;
   objectiveId: string;
   pages: PageItem[];
   requirements: RubricRequirementItem[];
}
