import * as util from "./util";
import { TargetItem } from "../src/target/targetInterface";
import { Arguments } from "yargs";
import * as flipted from "./fliptedCmd";
import * as service from "../src/target/targetService";
import * as helper from "../src/target/targetHelper";

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      const targets = await service.listTargetsByCourse(args.course);
      console.table(targets);
      console.log(`Total: ${targets.length} target items.`);
   } catch (err) {
      console.log(err);
   }
}

/// Course,TargetName,Description,Subject,GradeLevel,Icon,Standards
function generateTargetItems(records: any[]): TargetItem[] {
   const targets: TargetItem[] = records.map(record => {
      const input: TargetInput = {
         course: record.Course,
         targetName: record.TargetName,
         description: record.Description,
         gradeLevel: parseInt(record.GradeLevel),
         subject: record.Subject,
         icon: record.Icon,
         standards: record.Standards
      };

      return helper.targetInputToDBItem(input);
   });

   return targets;
}

async function importItems() {
   const filePath = "data/targets.csv";

   try {
      const records = await util.readFromCSV(filePath);
      const targets: TargetItem[] = generateTargetItems(records);
      const output = await service.importTargets(targets);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await service.deleteTargets();
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
   name: "target",
   desc: "Access target APIs",
   actionMap: actionMap
};

const targetCmd = flipted.cmdFactory(cmdArgs);

export default targetCmd;
