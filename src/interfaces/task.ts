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
   pages: PageItem[];
   requirements: RubricRequirementItem[];
   course: string;
   missionId: string;
   missionIndex: number;
   subMissionId: string;
   objectiveId: string;
   targetId: string;
}
