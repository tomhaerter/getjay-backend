import {router} from "../index";
import express from "express"

export default class StatusHandler {
    async initialize() {
        router.get("/status", this.getStatus);
    }

    async getStatus(req: express.Request, res: express.Response) {
        res.send({status: "OK"})
    }
}
