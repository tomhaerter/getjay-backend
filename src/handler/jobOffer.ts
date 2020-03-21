import {authRouter, router} from "../index";
import express from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {User} from "../database/entity/user";
import {JobOffer} from "../database/entity/jobOffer";
import Joi from '@hapi/joi';
import { IJobOffer } from "../types/api";

export default class JobOfferHandler {
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
        const jobOffer = await JobOfferHandler.findOneJobOffer(req, res);
        return jobOffer.toIJobOffer()
    }

    async bookmarkJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await JobOfferHandler.findOneJobOffer(req, res);
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

    static async createJobOffer(req: express.Request, res: express.Response) {
        const schema = Joi.object({
            employerId: Joi.string().alphanum().required(),
            categories: Joi.array().items(Joi.number()).min(1).required(),
            workdays: Joi.array().items(Joi.number()).min(1).required(),
            payment: Joi.number().greater(0).required(),
            description: Joi.string(),
            requirements: Joi.array().items(Joi.string()),
            geoHash: Joi.string().required(),
            from: Joi.number().min(0).max(24*60).required(),
            to: Joi.number().min(0).max(24*60).min(Joi.ref('from')).required(),
            image: Joi.string(),
        })

        // TODO: Check if Geohash is valid
        const post = req.jobOffer;
        let jobOffer: IJobOffer;
    }
}
