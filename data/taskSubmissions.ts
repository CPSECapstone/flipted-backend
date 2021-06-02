import { Arguments } from "yargs";
import taskSubmissionService from "../src/submissions/taskSubmission";
import * as flipted from "./fliptedCmd";

async function listItems(args: Arguments<flipted.IAction>) {
   if (!args.taskId) {
      console.log("Missing --taskId=xxx");
      return;
   }

   try {
      let submissions: TaskSubmissionSummary[] = await taskSubmissionService.listAllSubmissionsByCourse(
         args.course,
         args.taskId
      );
      console.table(submissions, [
         "studentName",
         "studentId",
         "taskName",
         "taskId",
         "pointsAwarded",
         "pointsPossible"
      ]);
      console.log(`Total: ${submissions.length} submission items.`);
   } catch (err) {
      console.log(err);
   }
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("listFn", listItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "taskSubmission",
   desc: "Access taskSubmissions APIs",
   actionMap: actionMap
};

const taskCmd = flipted.cmdFactory(cmdArgs);

export default taskCmd;
