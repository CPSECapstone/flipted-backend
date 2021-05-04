import { User } from "../interfaces";
import { CompositeDBItem } from "../services/dynamodb"


/***************** Input from Client *****************************/

export interface NewGoalInput {
    title: string;
    dueDate: Date;
    category: string;
    favorited: Boolean;
    assignee?: string;
    pointValue?: number;
}

export interface SubGoalInput {
    title: string;
    dueDate: Date;
}


/***************** Output to Client *****************************/

export interface Goal {
    id: string;
    title: string;
    dueDate: Date;
    completed: Boolean;
    completedDate?: Date;
    subGoals?: [SubGoal];
    category: string;
    favorited: Boolean;
    owner: string;
    assignee: string;
    pointValue?: number;
}

export interface SubGoal {
    id: string;
    title: string;
    dueDate: Date;
    completed: Boolean;
    completedDate?: Date;
}

/***************** Database item ******************************/

export interface GoalItem extends CompositeDBItem {
    id: string;
    title: string;
    dueDate: Date;
    completed: Boolean;
    completedDate?: Date;
    subGoals: [];
    category: string;
    favorited: Boolean;
    owner: string;
    assignee: string;
    pointValue?: number;
}

export interface SubGoalItem extends CompositeDBItem {
    title: string;
    dueDate: Date;
    completed: Boolean;
    completedDate?: Date;
}