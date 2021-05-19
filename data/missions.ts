import { Arguments } from "yargs";
import { readFile } from "fs/promises";
import * as flipted from "./fliptedCmd";
import * as service from "../src/mission/missionService";
import * as helper from "../src/mission/missionLogic";
import { MissionItem } from "../src/mission/missionInterface";

async function listItems(args: Arguments<flipted.IAction>) {
   try {
      const output = await service.listByCourse(args.course!);
      console.table(output, ["id", "name", "course", "description"]);
      console.log(`Total: ${output.length} mission items.`);
   } catch (err) {
      console.log(err);
   }
}

function generateMissionItems(records: any): MissionItem[] {
   const missions: MissionInput[] = records.missions;
   return missions.map(helper.convertMissionInputToItem);
}

async function importItems() {
   const filePath = "data/missions.json";

   try {
      const buffer = await readFile(filePath);
      const records = JSON.parse(buffer.toString());
      const missions = generateMissionItems(records);
      console.log(missions);
      const output = await service.importMissions(missions);
      console.log(output);
   } catch (err) {
      console.log(err);
   }
}

async function deleteItems() {
   try {
      const output = await service.deleteMissions();
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
   name: "mission",
   desc: "Access mission APIs",
   actionMap: actionMap
};

const missionCmd = flipted.cmdFactory(cmdArgs);

export default missionCmd;
