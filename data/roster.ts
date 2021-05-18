import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import chalk from "chalk";
import * as flipted from "./fliptedCmd";
import * as util from "./util";
import * as rosterService from "../src/roster/rosterService";
import userService from "../src/services/user";
import { RoleInternal } from "../src/interfaces/role";

async function addItem(args: Arguments<flipted.IAction>) {
   if (!args.input) {
      console.log("Missing --input=json_file_path");
      return;
   }

   try {
      const buffer = await readFile(args.input);
      const rawData = JSON.parse(buffer.toString());
      const student = <StudentInput>rawData.student;
      console.table(student);
      const output = await rosterService.addStudent(student);
      console.log(chalk.green(`Student added. ${output}`));
   } catch (err) {
      console.log(chalk.red(err));
   }
}

async function listItems() {
   const course = "Integrated Science";

   try {
      const students = await rosterService.listStudentsByCourse(course);
      console.table(students, ["course", "studentId", "email", "section", "team"]);
      console.log(`Total: ${students.length} roster items.`);
   } catch (err) {
      console.log(err);
   }
}

const TEAMS = ["alpha", "beta", "gamma"];
const COURSE = "Integrated Science";

async function importItems() {
   try {
      const users = await userService.listUsersByRole(RoleInternal.Student);
      const students = users.map(user => {
         return <StudentInput>{
            studentId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            course: COURSE,
            section: util.randomInt(1, 2),
            team: TEAMS[util.randomInt(0, 2)]
         };
      });
      console.table(students);
      const output = await rosterService.importStudents(students);
      console.table(output);
      // console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await rosterService.deleteStudents();
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("addFn", addItem);
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "roster",
   desc: "Access roster APIs",
   actionMap: actionMap
};

const rosterCmd = flipted.cmdFactory(cmdArgs);

export default rosterCmd;
