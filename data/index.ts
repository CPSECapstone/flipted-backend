#!/usr/bin/env node

import yargs from "yargs";
import courseCmd from "./courses";
import objectiveCmd from "./objectives";
import rosterCmd from "./roster";
import userCmd from "./users";
import taskCmd from "./tasks";
import taskblockCmd from "./taskblocks";

yargs
   .command(courseCmd)
   .command(objectiveCmd)
   .command(rosterCmd)
   .command(userCmd)
   .command(taskCmd)
   .command(taskblockCmd)
   .help().argv;