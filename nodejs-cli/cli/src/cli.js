import arg from 'arg';
import inquirer from 'inquirer';
import { optionsHandler } from './Helper/main'

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
        path: args['--path'] || false,
    }
}

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
        path: options.path, // we dont ask user for the path, we just set '.' (current dir) as path.
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    optionsHandler(options);
}