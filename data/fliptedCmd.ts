import yargs, { Arguments, Argv } from "yargs";

export interface IAction {
   action: string;
   id?: string;
   input?: string;
   view?: string;
}

export type ActionFn = (args: Arguments<IAction>) => void;

export type ActionIndex = "addFn" | "getFn" | "listFn" | "importFn" | "deleteFn";

export type ActionMap = Map<ActionIndex, ActionFn>;

export type CmdFactoryArgs = {
   name: string;
   desc: string;
   actionMap: ActionMap;
};

export function cmdFactory(cmdArgs: CmdFactoryArgs): yargs.CommandModule<{}, IAction> {
   const { name, desc, actionMap } = cmdArgs;

   const cmd: yargs.CommandModule<{}, IAction> = {
      command: `${name} <action>`,
      describe: desc,
      builder: (_args: Argv<{}>): Argv<IAction> => {
         return yargs
            .positional("action", {
               type: "string",
               describe: "the action you want to perform on the entity",
               choices: ["add", "get", "list", "import", "delete"],
               default: "help"
            })
            .option("view", {
               alias: "v",
               default: "table",
               describe: "view the data in table view",
               choices: ["table", "json"]
            });
      },
      handler: args => {
         const actionFnName: ActionIndex = <ActionIndex>`${args.action}Fn`;
         if (actionMap.has(actionFnName)) {
            actionMap.get(actionFnName)!(args);
         } else {
            console.log(`Unimplemented action: ${name} ${actionFnName}`);
         }
      }
   };

   return cmd;
}
