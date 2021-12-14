import arg from 'arg'
import inquirer from 'inquirer'
import { handleOptions } from './optionsHandler'

function parseArgumentsIntoOptions(rawArgs){
    const args = arg({
        '--yes': Boolean,
        '-y': '--yes'
    },
    {
        argv: rawArgs.slice(2)
    }
    );

    return {
        skipPrompts: args['--yes'] || false,
        action: args._[0]
    }
}

async function promptForMissingOptions(options){
    const questions = [];

    if(options.skipPrompts) {
        return {
            ...options,
            action: options.action || 'create'
        }
    }

    if(!options.action) {
        questions.push({
            type: 'list',
            name: 'action',
            message: 'Please choose an action',
            choices: ['create', 'delete'],
            default: 'create'
        })
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        action: options.action || answers.action
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    handleOptions(options);
}