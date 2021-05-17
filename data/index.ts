#!/usr/bin/env -S node --use_strict

import yargs from "yargs";
import objectiveCmd from "./objectives";

yargs.command(objectiveCmd).help().argv;
