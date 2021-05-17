#!/usr/bin/env -S node --use_strict

import yargs from "yargs";
import objectiveCmd from "./objectives";
import frQuestionCmd from "./frQuestions";
import mcQuestionCmd from "./mcQuestions";

yargs.command(objectiveCmd).command(frQuestionCmd).command(mcQuestionCmd).help().argv;
