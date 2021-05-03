import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { ObjectiveItem, ObjectivePK, ObjectiveSK } from "../interfaces/objective";

export function objectiveInputToDBItem(input: ObjectiveInput): ObjectiveItem {
   const objectiveId = uid();
   const item: ObjectiveItem = {
      PK: ObjectivePK(input.courseName),
      SK: ObjectiveSK(input.name),
      objectiveId,
      ...input
   };

   return item;
}

export function dbItemToObjective(item: ObjectiveItem): Objective {
   return <Objective>{
      objectiveId: item.objectiveId,
      name: item.name,
      description: item.description,
      targetId: item.targetId,
      targetName: item.targetName,
      courseName: item.courseName
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
