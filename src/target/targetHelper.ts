import { uid } from "uid/secure";
import { TargetItem, TargetKey } from "./targetInterface";

export function targetInputToDBItem(input: TargetInput): TargetItem {
   const targetId = uid();

   const item: TargetItem = {
      PK: TargetKey(targetId),
      SK: TargetKey(targetId),
      targetId,
      ...input
   };

   return item;
}

export function dbItemToTarget(item: TargetItem): Target {
   return <Target>{
      targetId: item.targetId,
      targetName: item.targetName,
      description: item.description,
      gradeLevel: item.gradeLevel,
      subject: item.subject,
      icon: item.icon,
      standards: item.standards,
      course: item.course,
      objectives: []
   };
}
