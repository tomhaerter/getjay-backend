import {authRouter, router} from "../index";
import express from "express"
import {wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {databaseOK} from '../database/database';

export default class StatusHandler {
    async initialize() {
        router
            .get("/status", wrap(this.getStatus));

        authRouter
            .get("/status/auth", wrap(this.getAuth));
    }

    async getStatus(req: express.Request, res: express.Response) {
        let ret = {
            status: "OK",
            databaseStatus: databaseOK ? 'OK' : 'Error',
        };
        res.send(ret)
    }

    async getAuth(req: express.Request, res: express.Response) {
        const u = await req.getUser();
        res.json({...req.firebaseUser, u})
    }
}
