export async function optionsHandler(options) {
    let verb = "";
    let project = options.name;
    let path = options.path;

    switch(options.action){
        case "create":
            verb = "creating";
            break;
        case "delete":
            verb = "deleting";
            break;
        case "ping":
            verb = "pong";
            break;
        default:
            console.error(options.action + " is not a valid action.");
            process.exit(1);
            break;
    }

    if(path === '.'){
        path = "current directory"
    }

    console.log("\x1b[36m", `${verb} ${project} in ${path} ...`, "\x1b[0m");
}