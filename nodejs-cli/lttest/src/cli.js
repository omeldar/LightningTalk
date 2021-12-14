import arg from 'arg';
import inquirer from 'inquirer';
import { handleOptions } from './optionsHandler'

function parseArgumentsIntoOptions(rawArgs){
    const args = arg(
        {
        '--yes': Boolean,
        '--template': String,
        '-y': '--yes',
        '-t': '--template'
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        action: args._[0],
        projName: args._[1],
        skipPrompts: args['--yes'] || false,
        template: args['--template'] || false
    };
}

async function promptForMissingOptions(options){
    const questions = [];

    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || 'default',
            action: options.action || 'create',
            projName: options.projName || 'my-project'
        };
    }

    if(!options.action) {
        questions.push({
            type: 'list',
            name: 'action',
            message: 'Please choose an action',
            choices: ['create', 'link'],
            default: 'create'
        });
    }

    if(!options.projName){
        questions.push({
            type: 'input',
            name: 'projName',
            message: 'Specify the project name',
            default: 'my-project'
        });
    }


    if(!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose a template.',
            choices: ['default', 'Empty'],
            default: 'default'
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        action: options.action || answers.action,
        projName: options.projName || answers.projName,
        template: options.template || answers.template,
        skipPrompts: options.skipPrompts,
    }
}

export async function cli(args){
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    handleOptions(options);
}