import {router} from "../index";
import express from "express"
import {wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";

export default class StatusHandler {
    async initialize() {
        router.get("/status", wrap(this.getStatus));
        router.use("/status/auth", authGuard);
        router.get("/status/auth", wrap(this.getAuth))
    }

    async getStatus(req: express.Request, res: express.Response) {
        res.send({status: "OK"})
    }

    async getAuth(req: express.Request, res: express.Response) {
        const u = await req.getUser();
        res.json({...req.firebaseUser, u})
    }
}
