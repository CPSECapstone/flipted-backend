import { readFile } from "fs/promises";
import { Arguments } from "yargs";
import chalk from "chalk";
import * as flipted from "./fliptedCmd";
import * as questionService from "../src/question/questionService";

function addItem() {
   console.log("To Be Implemented.");
}

function getItem() {
   console.log("To Be Implemented.");
}

async function listItems(args: Arguments<flipted.IAction>) {
   const view = args.view;

   try {
      const questions = await questionService.listMcQuestions();
      if (view == "table") {
         console.table(questions, ["id", "description", "points", "answers"]);
      } else {
         console.log(JSON.stringify(questions, null, "  "));
      }
   } catch (err) {
      console.log(chalk.red(err));
   }
}

async function importItems(args: Arguments<flipted.IAction>) {
   if (!args.input) {
      console.log("Missing --input=json_file_path");
      return;
   }

   try {
      const buffer = await readFile(args.input);
      const rawData = JSON.parse(buffer.toString());
      const mcQuestions = rawData.questions.map((question: any) => {
         return <McQuestionInput>{
            description: question.description,
            points: parseInt(question.points),
            options: question.options,
            answers: question.answers
         };
      });
      const output = await questionService.batchWriteMcQuestions(mcQuestions);
      console.log(output);
   } catch (err) {
      console.log(chalk.red(err));
   }
}

function deleteItems() {
   console.log("To Be Implemented.");
}

const actionMap: flipted.ActionMap = new Map();
actionMap.set("addFn", addItem);
actionMap.set("getFn", getItem);
actionMap.set("listFn", listItems);
actionMap.set("importFn", importItems);
actionMap.set("deleteFn", deleteItems);

const cmdArgs: flipted.CmdFactoryArgs = {
   name: "mcQuestion",
   desc: "Access MultipleChoiceQuestion APIs",
   actionMap: actionMap
};

const mcQuestionCmd = flipted.cmdFactory(cmdArgs);

export default mcQuestionCmd;
