#!/usr/bin/env node

import yargs from "yargs";
import courseCmd from "./courses";
import missionCmd from "./missions";
import missionMasteryCmd from "./missionMastery";
import objectiveCmd from "./objectives";
import progressCmd from "./progress";
import rosterCmd from "./roster";
import userCmd from "./users";
import targetCmd from "./targets";
import targetMasteryCmd from "./targetMastery";
import taskCmd from "./tasks";
import taskblockCmd from "./taskblocks";
import taskSubmissionCmd from "./taskSubmissions";

yargs
   .command(courseCmd)
   .command(missionCmd)
   .command(missionMasteryCmd)
   .command(objectiveCmd)
   .command(progressCmd)
   .command(rosterCmd)
   .command(userCmd)
   .command(targetCmd)
   .command(targetMasteryCmd)
   .command(taskCmd)
   .command(taskblockCmd)
   .command(taskSubmissionCmd)
   .help().argv;
