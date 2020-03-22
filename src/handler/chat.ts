import {router} from "../index";
import {HttpBadRequestError, HttpForbiddenError, wrap} from "../errorHandler";
import {Request} from "express";
import {Conversation} from "../database/entity/conversation";
import {JobOffer} from "../database/entity/jobOffer";
import {ChatMessage} from "../database/entity/chatMessage";
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

        const out = [];
        for (let i = 0; i < chats.length; i++) {
            out.push(await chats[i].toIConversation())
        }
        return out
    }

    /**
     * Get chat between a worker and a job offer(employee)
     * @param req
     */
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
            response.message = getRandomChatMessage(worker.firstName);
            await response.save();
        }, 5000);

        return chatMessage.toIChatMessage();
    }

}


const getRandomChatMessage = function (name: string) {
    const msgs = [`Hallo ${name}, vielen Dank für dein Interesse. Unser Team hier im Supermarkt braucht dringend Unterstützung. Wann kannst du anfangen?`,
        `Hallo ${name}, wir freuen uns, dass Sie so kurzfristig in unserer Kanzlei aushelfen können. Wann hätten sie Zeit für ein kurzes Skype-Gespräch?`,
        `Hi ${name}, freut uns riesig, dass du hier im Tierheim aushelfen willst - es ist wirklich Not am Mann! Kannst du morgen Mittag vorbei kommen?`,
        `Hallo ${name}, hast du Erfahrung mit Tieren?`,
        `Hallo ${name}, möchtest du gleich diese Woche anfangen?`];

    return msgs[Math.floor(Math.random() * msgs.length)];
};
