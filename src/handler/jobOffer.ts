import {authRouter, router} from "../index";
import express from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {User} from "../database/entity/user";
import {JobOffer} from "../database/entity/jobOffer";

export default class UserHandler {
    async initialize() {
        router
            .get('/jobOffer', wrap(this.getJobOffers))
            .get('/jobOffer/:id', wrap(this.getJobOffer));
        authRouter
            .post('/jobOffer/:id/bookmark', wrap(this.bookmarkJobOffer));
    }

    async getJobOffers(req: express.Request, res: express.Response) {
        return (await JobOffer.find()).map(a => a.id)
    }


    async getJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await UserHandler.findOneJobOffer(req, res);
        return jobOffer.toIJobOffer()
    }

    async bookmarkJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await UserHandler.findOneJobOffer(req, res);
        const user = await req.getUser();
        await user.bookmarkJobOffer(jobOffer);

        return
    }

    static async findOneJobOffer(req: express.Request, res: express.Response) {
        const id = req.params.id;
        const jobOffer = await JobOffer.findOne({id});
        if (!jobOffer) throw new HttpNotFoundError(`Could not find JobOffer with id ${id}`);

        return jobOffer;
    }
}
