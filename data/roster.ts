import csv from "csv-parser";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import chalk from "chalk";
import * as flipted from "./fliptedCmd";
import * as rosterService from "../src/roster/rosterService";

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
      console.table(students, ["PK", "SK", "section", "studentName", "team"]);
      console.log(`Total: ${students.length} roster items.`);
   } catch (err) {
      console.log(err);
   }
}

async function readStudentsFromCSV(filePath: string): Promise<StudentInput[]> {
   const buffer = await readFile(filePath);
   const rawData = parse(buffer.toString(), { columns: true, skip_empty_lines: true });
   const students: StudentInput[] = rawData.map((record: any) => {
      return <StudentInput>record;
   });
   console.log(`readStudentsFromCSV: total of ${students.length} student items.`);

   return students;
}

async function importItems(args: Arguments<flipted.IAction>) {
   if (!args.input) {
      console.log("Missing --input=json_file_path");
      return;
   }

   try {
      const students = await readStudentsFromCSV(args.input);
      console.table(students);
      const output = await rosterService.importStudents(students);
      console.log(output);
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
