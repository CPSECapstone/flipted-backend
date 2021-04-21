import { TaskBlock } from "./taskblock";

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

export interface Page {
   skippable: boolean;
   blocks: TaskBlock[];
}

export interface PageInput {
   skippable: boolean;
}

export interface RubricRequirement {
   id: string;
   description: string;
   isComplete: boolean;
}

export interface RubricRequirementInput {
   description: string;
}

export interface TaskProgress {
   username: string;
   taskId: string;
   finishedRequirementIds: string[];
}
