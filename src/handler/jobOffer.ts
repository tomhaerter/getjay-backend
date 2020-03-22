import {router} from "../index";
import express, {Request, Response} from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {JobOffer, Workdays, Category} from "../database/entity/jobOffer";
import Joi from '@hapi/joi';
import { IJobOffer } from "../types/api";
import {authGuard} from "../middleware/authGuard.middleware";
import {Conversation} from "../database/entity/conversation";
import Geohash from 'unl-core';
import { MoreThanOrEqual, LessThanOrEqual, In, Like } from "typeorm";

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
        const schema = Joi.object({
            skip: Joi.number().integer().min(0),
            take: Joi.number().integer().min(1),
            search: Joi.string(),
            workdays: Joi.array().items(Joi.number().integer().min(0).max(Object.keys(Workdays).length)).unique(),
            categories: Joi.array().items(Joi.number().integer().min(0).max(Object.keys(Category).length)).unique(),
            from: Joi.number().min(0).max(24*60),
            to: Joi.number().min(0).max(24*60).min(Joi.ref('from')),
            geo: Joi.string(),
        });
        const validationResult = schema.validate(req.query);
        if (validationResult.errors) {
            throw new HttpBadRequestError(validationResult.errors.message);
        }
        // let geoHash = this.verifyGeoHash(validationResult.value.geoHash, validationResult.value.lat, validationResult.value.lon);

        const from = validationResult.value.from ?? 0;
        const to = validationResult.value.to ?? 24*60;
        let workdays: string[] = [];
        let categories: string[] = [];

        let results = await JobOffer.find({
            where: {
                from: MoreThanOrEqual(from),
                to: LessThanOrEqual(to),
                description: validationResult.value.search ? Like(`${validationResult.value.search}`) : undefined,
            },
        });

        if (validationResult.value.workdays) {
            workdays = (validationResult.value.workdays as number[]).map(item => item.toString());
            results = results.filter(offer => offer.workdays.filter(value => workdays.includes(value.toString())).length > 0);
        }
        
        if  (validationResult.value.categories) {
            categories = (validationResult.value.categories as number[]).map(item => item.toString());
            results = results.filter(offer => offer.categories.filter(value => categories.includes(value.toString())).length > 0);
        }

        results = results.slice(validationResult.value.skip, validationResult.value.take);
        return results.map(a => a.toIJobOffer());
    }


    async getJobOffer(req: express.Request, res: express.Response) {
        const schema = Joi.object({
            id: Joi.string().required(),
        });
        const validationResult = await schema.validate(req.params);
        if (validationResult.error) {
            throw new HttpBadRequestError(validationResult.error.message);
        }

        const jobOffer = await JobOfferHandler.findOneJobOffer(validationResult.value, res);
        return jobOffer.toIJobOffer();
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

        // let geoHash = this.verifyGeoHash(validationResult.value.geoHash, validationResult.value.lat, validationResult.value.lon);

        const user = await req.getUser();

        const j = validationResult.value as IJobOffer;
        j.employerId = user.id;

        const jobOffer = await JobOffer.createJobOffer(j);
        if (!jobOffer) throw new HttpBadRequestError();
        return jobOffer;
    }

    verifyGeoHash(geoHash: string, lat: number, lon: number): string {
        let res;
        if (geoHash) {
            try {
                const { lat, lon } = Geohash.decode(geoHash); // Check for valid geohash
                res = geoHash;
            } catch (err) {
                throw new HttpBadRequestError('Bad geohash format!');
            }
        } else {
            try {
                res = Geohash.encode(lat, lon);
            } catch (err) {
                throw new HttpBadRequestError('Bad lat/lon format!');
            }
        }
        return res;
    }
}
