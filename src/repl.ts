import repl = require('repl');
import {User} from "./database/entity/user";
import {JobOffer} from "./database/entity/jobOffer";

export async function startRepl() {
    const replInstance = repl.start("> ");
    replInstance.context.User = User;
    replInstance.context.JobOffer = JobOffer;
}
