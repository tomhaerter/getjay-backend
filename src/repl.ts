import repl = require('repl');
import {User} from "./database/entity/user";
import {JobOffer} from "./database/entity/jobOffer";
import { EmployerInformation } from './database/entity/employerInformation';
import { WorkerInformation } from './database/entity/workerInformation';

export async function startRepl() {
    const replInstance = repl.start("> ");
    replInstance.context.User = User;
    replInstance.context.JobOffer = JobOffer;
    replInstance.context.EmployerInformation = EmployerInformation;
    replInstance.context.WorkerInformation = WorkerInformation;
}