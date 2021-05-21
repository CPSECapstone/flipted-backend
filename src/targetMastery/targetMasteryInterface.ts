export type StudentObjectiveMasteryItem = CompositeDBItem & {
   targetId: string;
   mastery: string;
   source?: string;
};

export const StudentObjectiveMasteryPKPrefix = "STUDENT";
export const StudentObjectiveMasterySKPrefix = "OBJECTIVE";

export function StudentObjectiveMasteryPK(studentId: string): string {
   return `STUDENT#${studentId}`;
}

export function StudentObjectiveMasterySK(objectiveId: string): string {
   return `OBJECTIVE#${objectiveId}`;
}
