import {
   StudentObjectiveMasteryItem,
   StudentObjectiveMasteryPK,
   StudentObjectiveMasterySK
} from "./targetMasteryInterface";

export function objectiveMasteryInputToDBItem(
   input: StudentObjectiveMasteryInput
): StudentObjectiveMasteryItem {
   return {
      PK: StudentObjectiveMasteryPK(input.studentId),
      SK: StudentObjectiveMasterySK(input.objectiveId),
      targetId: input.targetId,
      mastery: input.mastery
   };
}

export function generateClassTargetMastery(
   target: Target,
   objectives: Array<Objective>,
   students: Array<Student>,
   masteryItems: Array<StudentObjectiveMasteryItem>
): ClassTargetMastery {
   const masteryMap: Map<string, Array<ObjectiveMastery>> = new Map();
   masteryItems.forEach(item => {
      const [, studentId] = item.PK.split("#");
      const [, objectiveId] = item.SK.split("#");

      const objectiveMastery: ObjectiveMastery = {
         targetId: target.targetId,
         objectiveId,
         mastery: item.mastery
      };

      if (masteryMap.has(studentId)) {
         masteryMap.get(studentId)!.push(objectiveMastery);
      } else {
         masteryMap.set(studentId, [objectiveMastery]);
      }
   });

   const studentObjectiveMasteryList: Array<StudentObjectiveMastery> = students.map(student => {
      return {
         student,
         objectiveMasteryList: masteryMap.get(student.studentId) || []
      };
   });

   target.objectives = objectives;

   return {
      target,
      studentObjectiveMasteryList
   };
}
