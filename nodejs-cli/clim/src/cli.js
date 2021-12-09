import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs){
    const args = arg(
        {
            '--path': String,
            '--template': String,
            '-p': '--path',
            '-t':'--template'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        action: args._[0],
        name: args._[1],
        path: args['--path'] || '.',
        template: args['--template'] || false
    }
}

async function promptForMissingOptions(options){
    const defaultTemplate = 'hello-world';
    const defaultAction = 'info';
    const questions = [];

    if(options.action !== 'create' || 
    options.action !== 'delete' || 
    options.action !== 'info'){
        questions.push({
            type: 'list',
            name: 'action',
            message: 'Select a valid action',
            choices: ['create', 'delete', 'info'],
            default: defaultAction
        })
    }

    if(!options.name && path.basename(options.name)){
        
    }

    if(!options.template){
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please select one of the existing templates',
            choices: ['hello-world', 'Empty Project', 'Template Project', 'Empty Folder'],
            defualt: defaultTemplate
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        action: options.action || answers.action,
        name: options.name || answers.name,
        path: options.path || answers.path,
        template: options.template || answers.template
    }
}

export function cli(args){
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
}