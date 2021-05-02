import { unmarshall } from "@aws-sdk/util-dynamodb";
import { uid } from "uid/secure";
import { LearningTargetItem } from "../interfaces/learningTarget";

export function learningTargetInputToDBItem(input: LearningTargetInput): LearningTargetItem {
   const targetId = uid();
   const item: LearningTargetItem = {
      PK: `TARGET#${targetId}`,
      SK: `TARGET#${targetId}`,
      ...input
   };

   return item;
}

export function dbItemToLearningTarget(item: LearningTargetItem): LearningTarget {
   const [_, id] = item.PK.split("#");

   return <LearningTarget>{
      id,
      name: item.name,
      description: item.description,
      gradeLevel: item.gradeLevel,
      course: item.course,
      subject: item.subject,
      icon: item.icon,
      standards: item.standards
   };
}

export function dbItemsToLearningTargets(items: any[]): LearningTarget[] {
   const targets = items.map(rawItem => {
      const item = <LearningTargetItem>unmarshall(rawItem);
      const target = dbItemToLearningTarget(item);
      return target;
   });

   return targets;
}
