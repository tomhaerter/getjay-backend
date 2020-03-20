import {router} from "../index";
import express from "express"
import {wrap} from "../errorHandler";

export default class StatusHandler {
    async initialize() {
        router.get("/status", wrap(this.getStatus));
    }

    async getStatus(req: express.Request, res: express.Response) {
        res.send({status: "OK"})
    }
}
