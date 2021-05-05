import { CompositeDBItem } from "../services/dynamodb"

export interface GoalItem extends CompositeDBItem {
    PK: string // GOAL#<username>
    SK: string // GOAL#<goalid>
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
    subGoals: SubGoalItem[];
    category: string;
    favorited: boolean;
    owner: string;
    assignee: string;
    pointValue: number;
}

export interface SubGoalItem {
    title: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
}