# Use `flipted` Command Line Interface (cli)

Now we have a `flipted` cli tool for interacting with our service API and database.

### Supported Commands

```
$flipted --help
flipted [command]

Commands:
  flipted objective <action>  Access objective APIs
  flipted roster <action>     Access roster APIs
  flipted user <action>       Access user APIs

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

### Todo

+ [x] Add help info
+ [x] Support `objective` commands
+ [x] Support `roster` commands
+ [x] Support `user` commands
+ [ ] Support `frQuestion` commands
+ [ ] Support `mcQuestion` commands
+ [ ] Support `task` commands
+ [ ] Support `mission` commands
