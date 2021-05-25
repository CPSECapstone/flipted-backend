# Use `flipted` Command Line Interface (cli)

Now we have a `flipted` cli tool for interacting between our service APIs and database.

### Supported Commands

```
$flipted --help
flipted [command]

Commands:
  flipted course <action>          Access course APIs
  flipted mission <action>         Access mission APIs
  flipted missionMastery <action>  Access missionMastery APIs
  flipted objective <action>       Access objective APIs
  flipted progress <action>        Access progress APIs
  flipted roster <action>          Access roster APIs
  flipted user <action>            Access user APIs
  flipted target <action>          Access target APIs
  flipted targetMastery <action>   Access targetMastery APIs
  flipted task <action>            Access task APIs
  flipted taskblock <action>       Access taskblock APIs

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

#### Examples

```
flipted objective add --input=data/objective.json
flipted objective get --id=xxx
flipted objective list
flipted objective import
flipted objective delete
```

### To Use It

1. Run `npm run compile` command to compile typescript to javascript, as `flipted` is linked to a compiled javascript file under `.build` folder.

2. Run `npm install -g .` to install the `bin` script. This will add `flipted` to the system path. Whenever you type `flipted` in the command line interface, it will run the file that is pointed by `bin`. See `package.json` for more info.


### To Support More Commands

1. See `data/index.ts` and `data/objectives.ts` for examples.


### References

+ [Use an npm script as “bin”](https://stackoverflow.com/questions/55820752/use-an-npm-script-as-bin)
+ [yargs](https://www.npmjs.com/package/yargs)
