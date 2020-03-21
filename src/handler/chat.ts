import {router} from "../index";
import {HttpBadRequestError, HttpForbiddenError, wrap} from "../errorHandler";
import {Request, Response} from "express";
import {Conversation} from "../database/entity/conversation";
import {JobOffer} from "../database/entity/jobOffer";
import {ChatMessage} from "../database/entity/chatMessage";
import * as faker from "faker";
import {authGuard} from "../middleware/authGuard.middleware";

export default class ChatHandler {
    async initialize() {
        router
            .get("/chat", authGuard, wrap(this.getChats))
            .get("/chat/:offerId", authGuard, wrap(this.getChatWith))
            .post("/chat/:offerId/send", authGuard, wrap(this.sendChatMessage))
    }

    async getChats(req: Request) {
        const worker = await req.getUser();
        const chats = await Conversation.find({
            where: {
                archived: false,
                workerId: worker.id
            }
        });

        return chats.map(c => c.toIConversation());
    }

    async getChatWith(req: Request) {
        const worker = await req.getUser();
        if (!await worker.isWorker()) throw new HttpForbiddenError("You are not an worker!");
        const offer = await JobOffer.findOneOrFail({id: req.params.offerId});

        const conversation = await Conversation.getBetween(worker.id, offer.id);
        return conversation.toIConversation();
    }


    async sendChatMessage(req: Request) {
        if (!req.body.message) throw new HttpBadRequestError("No Message");

        const worker = await req.getUser();
        if (!await worker.isWorker()) throw new HttpForbiddenError("You are not an worker!");

        const offer = await JobOffer.findOneOrFail({id: req.params.offerId});
        const conversation = await Conversation.getBetween(worker.id, offer.id);

        const chatMessage = new ChatMessage();
        chatMessage.authorId = worker.id;
        chatMessage.conversationId = conversation.id;
        chatMessage.message = req.body.message;
        await chatMessage.save();

        //Fake response 5 secs later
        setTimeout(async () => {
            const response = new ChatMessage();
            response.authorId = offer.employerId;
            response.conversationId = conversation.id;
            response.message = faker.hacker.phrase();
            await response.save();
        }, 5000);

        return chatMessage.toIChatMessage();
    }

}
