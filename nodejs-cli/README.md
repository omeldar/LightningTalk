# NodeJs CLI

How to build a simple cli with nodejs.

1. Run `mkdir <projname> && cd <projname>` and then run `npm init`. Now open it in code with `npm code`

2. Create src/cli.js with code
```javascript
export function cli(args){
    console.log(args);
}
```

3. Create bin/dep
```javascript
#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../src/cli').cli(process.argv);
```

The bin/dep will be our cli's entrypoint. We as well require esm in here that enables us to use import in the other files.

4. run `npm link`

This command will globally install a symlink to this current project so there's no need for us to re-run this when we update our code. 
We should have the CLI commands available after this.

5. We can now test it and run `dep` without and with arguments.

6. Add imports and create function in cli.js

``` javascript
import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--path': String,
            '-p': '--path'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        action: args._[0],
        name: args._[1],
        path: args['--path'] || false
    }
}
```

7. Add following line to the cli function:
``` javascript
let options = parseArgumentsIntoOptions(args);
```

8. Now test it by executing ```dep create jarvis``` and `dep create jarvis -p "C:\"` and `dep create jarvis --path "C:\Users\"`

9. What if the user does not specify all the information we need? Well we'll just prompt him for it. So lets add another function:
``` javascript
async function promptForMissingOptions(options){
    const questions = [];
    
    if(!options.action) {
        questions.push({
            type: 'list',
            name: 'action',
            message: 'Please choose from below.',
            choices: ['create', 'delete']
        });
    }

    if(!options.name){
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Specify the project name'
        });
    }

    if(!options.path){
        options.path = '.';
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        action: options.action || answers.action,
        name: options.name || answers.name,
        path: options.path 
    }
}
```

10. And then make the cli() function an async function `export async cli(args) {...}` and add the code below to call the new prompt function.
```javascript 
options = await promptForMissingOptions(options);
```

11. Now lets execute it by running `dep`

12. Create the main.js in the src folder and fill it with following code:
``` javascript
export async function optionsHandler(options) {
    console.log(options);
}
```

13. Run `dep` with all different possible combinations and test the cli

_Tutorial End_