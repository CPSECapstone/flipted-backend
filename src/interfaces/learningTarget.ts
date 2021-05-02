import { CompositeDBItem } from "../services/dynamodb";

export type LearningTargetItem = CompositeDBItem &
   Omit<LearningTarget, "__typename" | "id" | "objectives">;
