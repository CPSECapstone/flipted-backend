#!/usr/bin/env -S node --use_strict

import yargs from "yargs";
import objectiveCmd from "./objectives";
import rosterCmd from "./roster";
import userCmd from "./users";

yargs.command(objectiveCmd).command(rosterCmd).command(userCmd).help().argv;
