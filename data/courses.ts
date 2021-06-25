import * as util from "./util";
import * as flipted from "./fliptedCmd";
import * as service from "../src/course/courseService";
import * as helper from "../src/course/courseHelper";
import { CourseTeacherItem } from "../src/course/courseInterface";

async function listItems() {
   try {
      const output = await service.listCourseInfos("Mr. Butcher");
      console.table(output);
      console.log(`Total: ${output.length} course items.`);
   } catch (err) {
      console.log(err);
   }
}

/// "Description","Instructor","Course"
function generateCourseItems(records: any[]): CourseTeacherItem[] {
   const courses: CourseTeacherItem[] = records.map(record => {
      const input: CourseInput = {
         course: record.Course,
         instructor: record.Instructor,
         description: record.Description
      };

      return helper.courseInputToDBItem(input);
   });

   return courses;
}

async function importItems() {
   const filePath = "data/courses.csv";

   try {
      const records = await util.readFromCSV(filePath);
      const courses = generateCourseItems(records);
      console.table(courses);
      const output = await service.importCourses(courses);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await service.deleteCourses();
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
   name: "course",
   desc: "Access course APIs",
   actionMap: actionMap
};

const courseCmd = flipted.cmdFactory(cmdArgs);

export default courseCmd;
