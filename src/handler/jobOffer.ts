import {router} from "../index";
import express, {Request, Response} from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {JobOffer} from "../database/entity/jobOffer";
import Joi from '@hapi/joi';
import { IJobOffer } from "../types/api";
import {authGuard} from "../middleware/authGuard.middleware";
import {Conversation} from "../database/entity/conversation";


export default class JobOfferHandler {
    async initialize() {
        router
            .get('/jobOffer', wrap(this.getJobOffers))
            .get('/jobOffer/:id', wrap(this.getJobOffer))
            //employer
            .post('/jobOffer/create', authGuard, wrap(this.createJobOffer))
            //worker
            .post('/jobOffer/:id/bookmark', authGuard, wrap(this.bookmarkJobOffer))
            .post('/jobOffer/:id/unbookmark', authGuard, wrap(this.unBookmarkJobOffer))
            .post('/jobOffer/:id/accept', authGuard, wrap(this.acceptJobOffer))
            .post('/jobOffer/:id/reject', authGuard, wrap(this.rejectJobOffer))
    }

    async acceptJobOffer(req: Request) {
        const jobOffer = await JobOffer.findOneOrFail({id: req.params.id});
        const user = await req.getUser();

        await user.acceptJobOffer(jobOffer);
        const conversation = await Conversation.getBetween(user.id, jobOffer.id, true);
        return conversation.toIConversation();
    }

    async rejectJobOffer(req: Request) {
        const jobOffer = await JobOffer.findOneOrFail({id: req.params.id});
        const user = await req.getUser();

        await user.rejectJobOffer(jobOffer);

        //archive conversation
        const conversation = await Conversation.getBetween(user.id, jobOffer.id);
        conversation.archived = true;
        await conversation.save();
        return;
    }


    async getJobOffers(req: express.Request, res: express.Response): Promise<IJobOffer[]> {
        return (await JobOffer.find()).map(a => a.toIJobOffer());
    }


    async getJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await JobOfferHandler.findOneJobOffer(req, res);
        return jobOffer.toIJobOffer()
    }

    async bookmarkJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await JobOfferHandler.findOneJobOffer(req, res);
        const user = await req.getUser();
        await user.bookmarkJobOffer(jobOffer);
        return;
    }

    async unBookmarkJobOffer(req: express.Request, res: express.Response) {
        const jobOffer = await JobOfferHandler.findOneJobOffer(req, res);
        const user = await req.getUser();
        await user.unBookmarkJobOffer(jobOffer);
        return;
    }

    static async findOneJobOffer(req: express.Request, res: express.Response): Promise<JobOffer> {
        const id = req.params.id;
        const jobOffer = await JobOffer.findOne({id});
        if (!jobOffer) throw new HttpNotFoundError(`Could not find JobOffer with id ${id}`);

        return jobOffer;
    }

    async createJobOffer(req: express.Request, res: express.Response): Promise<JobOffer> {
        const schema = Joi.object({
            title: Joi.string().required(),
            categories: Joi.array().items(Joi.number()).min(1).required(),
            workdays: Joi.array().items(Joi.number()).min(1).required(),
            payment: Joi.number().greater(0).required(),
            description: Joi.string(),
            requirements: Joi.array().items(Joi.string()),
            geoHash: Joi.string().required(),
            from: Joi.number().min(0).max(24*60).required(),
            to: Joi.number().min(0).max(24*60).min(Joi.ref('from')).required(),
            image: Joi.string(),
        });

        const validationResult = await schema.validate(req.body);
        if (validationResult.error) {
            throw new HttpBadRequestError(validationResult.error.message);
        }

        // TODO: Check if Geohash is valid

        const user = await req.getUser();

        // const employerInformation = await EmployerInformation.findOne({
        //     where: {
        //         uid: user.id,
        //     },
        //     relations: ['users']
        // });

        const j = validationResult.value as IJobOffer;
        j.employerId = user.id;
        // j.employer = employerInformation;

        const jobOffer = await JobOffer.createJobOffer(j);
        if (!jobOffer) throw new HttpBadRequestError();
        return jobOffer;
    }
}
