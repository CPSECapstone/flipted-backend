import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { TargetItem, TargetPK, TargetSK } from "../interfaces/target";

export function targetInputToDBItem(input: TargetInput): TargetItem {
   const targetId = uid();
   const item: TargetItem = {
      PK: TargetPK(input.course),
      SK: TargetSK(targetId),
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
      course: item.course,
      subject: item.subject,
      icon: item.icon,
      standards: item.standards
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
