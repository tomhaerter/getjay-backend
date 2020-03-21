import {router} from "../index";
import express from "express"
import {wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {databaseOK} from '../database/database';

export default class StatusHandler {
    async initialize() {
        router.use("/account/signup", authGuard);
        router.post("/account/signup", wrap(this.postSignup))
    }
    
    async postSignup(req: express.Request, res: express.Response) {
        let ret = {
            status: "OK",
            databaseStatus: databaseOK ? 'OK' : 'Error',
        }
        res.send(ret)
    }
}
