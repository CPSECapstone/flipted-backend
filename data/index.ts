#!/usr/bin/env -S node --use_strict

import yargs from "yargs";
import objectiveCmd from "./objectives";
import rosterCmd from "./roster";

yargs.command(objectiveCmd).command(rosterCmd).help().argv;
