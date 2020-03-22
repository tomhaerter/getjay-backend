import {router} from "../index";
import express from "express"
import {HttpBadRequestError, HttpNotFoundError, wrap} from "../errorHandler";
import {authGuard} from "../middleware/authGuard.middleware";
import {User} from "../database/entity/user";

export default class UserHandler {
    async initialize() {
        router
            .get('/user/me', authGuard, wrap(this.getMe))
            .get('/user/me/bookmarkedJobOffers', authGuard, wrap(this.getMyBookmarks))
            .get('/user/me/acceptedJobOffers', authGuard, wrap(this.getAcceptedJobOffers))
            .get('/user/:id', wrap(this.getUser));
    }

    async getMe(req: express.Request, res: express.Response) {
        return (await req.getUser()).toIOwnUser();
    }

    async getMyBookmarks(req: express.Request, res: express.Response) {
        const user = await req.getUser();
        const bookmarks = await user.bookmarkedJobOffers;
        return bookmarks.map(a => a.toIJobOffer())
    }

    async getAcceptedJobOffers(req: express.Request) {
        const user = await req.getUser();
        const acceptedJobOffers = await user.acceptedJobOffers;
        return acceptedJobOffers.map(a => a.toIJobOffer())
    }

    async getUser(req: express.Request, res: express.Response) {
        const id = req.params.id;
        if (!id) throw new HttpBadRequestError("Param ID not found!");

        const user = await User.findOne({id});
        if (!user) throw new HttpNotFoundError("User not found!");

        return user.toIUser()
    }
}
