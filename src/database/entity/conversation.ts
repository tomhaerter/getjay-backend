import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import shortid from "shortid";
import {User} from "./user";
import {ChatMessage} from "./chatMessage";
import {JobOffer} from "./jobOffer";
import {HttpNotFoundError} from "../../errorHandler";
import {IConversation} from "../../types/api";

@Entity()
export class Conversation extends BaseEntity {
    @PrimaryColumn()
    id: string = shortid();

    @Column()
    workerId: string;

    @ManyToOne(type => User)
    @JoinColumn()
    worker: Promise<User>;

    @Column()
    jobOfferId: string;

    @ManyToOne(type => JobOffer)
    @JoinColumn()
    jobOffer: Promise<JobOffer[]>;

    @OneToMany(type => ChatMessage, cm => cm.conversation)
    messages: Promise<ChatMessage[]>;

    @Column()
    archived: boolean = false;

    async toIConversation() {
        return {
            id: this.id,
            workerId: this.workerId,
            jobOfferId: this.jobOfferId,
            messages: await Promise.all((await this.messages).map(msg => msg.toIChatMessage()))
        } as IConversation
    }

    static async getBetween(workerId: string, offerId: string, create = false) {
        let conversation = await Conversation.findOne({where: {workerId: workerId, jobOfferId: offerId}});
        if (!create) {
            if (!conversation) throw new HttpNotFoundError("Chat not found");
            if (conversation.archived) throw new HttpNotFoundError("Chat was archived!");
            return conversation;
        }
        if (!conversation) conversation = await this.createBetween(workerId, offerId);
        if (conversation.archived) {
            conversation.archived = false;
            await conversation.save();
        }

        return conversation
    }

    private static async createBetween(workerId: string, jobOfferId: string) {
        const conversation = Conversation.create({workerId, jobOfferId});
        await conversation.save();
        return conversation;
    }
}
