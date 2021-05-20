import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { TaskKey } from "../interfaces/task";
import { CompositeDBItem } from "../services/dynamodb";
import { ObjectiveItem, ObjectiveKey } from "./objectiveInterface";

export function objectiveInputToDBItem(input: ObjectiveInput): ObjectiveItem {
   const objectiveId = uid();

   const item: ObjectiveItem = {
      PK: ObjectiveKey(objectiveId),
      SK: ObjectiveKey(objectiveId),
      objectiveId,
      ...input
   };

   return item;
}

export function objectTaskRecordItem(objectiveId: string, taskId: string): CompositeDBItem {
   return {
      PK: ObjectiveKey(objectiveId),
      SK: TaskKey(taskId)
   };
}

export function dbItemToObjective(item: ObjectiveItem): Objective {
   return <Objective>{
      objectiveId: item.objectiveId,
      objectiveName: item.objectiveName,
      description: item.description,
      targetId: item.targetId,
      targetName: item.targetName,
      course: item.course,
      taskIds: item.taskIds,
      tasks: []
   };
}
