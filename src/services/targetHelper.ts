import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { TargetItem, TargetPK, TargetSK } from "../interfaces/target";

export function targetInputToDBItem(input: TargetInput): TargetItem {
   const targetId = uid();
   const item: TargetItem = {
      PK: TargetPK(input.courseName),
      SK: TargetSK(input.name),
      targetId,
      ...input
   };

   return item;
}

export function dbItemToTarget(item: TargetItem): Target {
   return <Target>{
      targetId: item.targetId,
      name: item.name,
      description: item.description,
      gradeLevel: item.gradeLevel,
      subject: item.subject,
      icon: item.icon,
      standards: item.standards,
      courseName: item.courseName
   };
}

export function dbItemsToTargets(items: any[]): Target[] {
   const targets = items.map(rawItem => {
      const item = <TargetItem>unmarshall(rawItem);
      const target = dbItemToTarget(item);
      return target;
   });

   return targets;
}
