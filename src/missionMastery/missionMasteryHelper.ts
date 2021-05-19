import {
   StudentMissionMasteryItem,
   StudentMissionMasteryPK,
   StudentMissionMasterySK
} from "./missionMasteryInterface";

export function missionMasteryInputToDBItem(
   mastery: StudentMissionMasteryInput
): StudentMissionMasteryItem {
   return {
      PK: StudentMissionMasteryPK(mastery.missionId),
      SK: StudentMissionMasterySK(mastery.studentId),
      currentTaskId: mastery.currentTaskId,
      level: mastery.level,
      progress: mastery.progress
   };
}

export function generateClassMissionMastery(
   students: Student[],
   mission: Mission,
   tasks: Task[],
   masteryItems: StudentMissionMasteryItem[]
): ClassMissionMastery {
   const masteryMap: Map<string, StudentMissionMasteryItem> = new Map();
   masteryItems.forEach(item => {
      const [, studentId] = item.SK.split("#");
      masteryMap.set(studentId, item);
   });

   const taskMap: Map<string, Task> = new Map();
   tasks.forEach(task => {
      taskMap.set(task.id, task);
   });

   const studentMissionMasteryList = students.map(student => {
      const item = masteryMap.get(student.studentId);
      const currentTaskId = item?.currentTaskId || tasks[0].id;

      return <StudentMissionMastery>{
         student,
         currentTaskId: currentTaskId,
         currentTaskName: taskMap.get(currentTaskId)!.name,
         level: item?.level || 0,
         progress: item?.progress || 0
      };
   });

   return {
      mission,
      studentMissionMasteryList
   };
}
