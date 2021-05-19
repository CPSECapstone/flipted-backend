#!/usr/bin/env node

import yargs from "yargs";
import courseCmd from "./courses";
import missionCmd from "./missions";
import objectiveCmd from "./objectives";
import rosterCmd from "./roster";
import userCmd from "./users";
import targetCmd from "./targets";
import taskCmd from "./tasks";
import taskblockCmd from "./taskblocks";

yargs
   .command(courseCmd)
   .command(missionCmd)
   .command(objectiveCmd)
   .command(rosterCmd)
   .command(userCmd)
   .command(targetCmd)
   .command(taskCmd)
   .command(taskblockCmd)
   .help().argv;
