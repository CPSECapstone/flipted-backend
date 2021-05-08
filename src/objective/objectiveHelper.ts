import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
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

export function dbItemsToObjectives(items: any[]): Objective[] {
   const targets = items.map(rawItem => {
      const item = <ObjectiveItem>unmarshall(rawItem);
      const target = dbItemToObjective(item);
      return target;
   });

   return targets;
}
