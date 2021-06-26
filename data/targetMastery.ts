import { Arguments } from "yargs";
import * as util from "./util";
import * as flipted from "./fliptedCmd";
import * as targetMasteryService from "../src/targetMastery/targetMasteryService";
import * as helper from "../src/targetMastery/targetMasteryHelper";
import * as rosterService from "../src/course/courseService";
import * as objectiveService from "../src/objective/objectiveService";
import { StudentObjectiveMasteryItem } from "../src/targetMastery/targetMasteryInterface";

async function listItems(args: Arguments<flipted.IAction>) {
   if (!args.targetId) {
      console.log("Missing --targetId=xxx");
      return;
   }

   try {
      const output = await targetMasteryService.listStudentObjectiveMasteryItemByTarget(
         args.targetId
      );
      console.table(output);
      console.log(`Total: ${output.length} mission mastery items.`);
   } catch (err) {
      console.log(err);
   }
}

const masteryStatusList = ["NOT_GRADED", "NOT_MASTERED", "NEARLY_MASTERED", "MASTERED"];

function generateStudentObjectiveMasteryItems(
   students: Student[],
   objectives: Array<Objective>
): StudentObjectiveMasteryItem[] {
   const masteryItems: Array<StudentObjectiveMasteryItem> = [];

   objectives.forEach(objective => {
      students.forEach(student => {
         const input: StudentObjectiveMasteryInput = {
            targetId: objective.targetId,
            objectiveId: objective.objectiveId,
            studentId: student.studentId,
            mastery: masteryStatusList[util.randomInt(0, 3)]
         };
         const item = helper.objectiveMasteryInputToDBItem(input);

         masteryItems.push(item);
      });
   });

   return masteryItems;
}

async function importItems(args: Arguments<flipted.IAction>) {
   const course = args.course;
   try {
      const students: Student[] = await rosterService.listStudentsByCourse(course);
      console.table(students);
      const objectives: Array<Objective> = await objectiveService.listObjectivesByCourse(course);
      console.table(objectives);

      const mastertItems = generateStudentObjectiveMasteryItems(students, objectives);
      console.table(mastertItems);

      const output = await targetMasteryService.importItems(mastertItems);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await targetMasteryService.deleteItems();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "targetMastery",
   desc: "Access targetMastery APIs",
   actionMap: actionMap
};

const courseCmd = flipted.cmdFactory(cmdArgs);

export default courseCmd;
