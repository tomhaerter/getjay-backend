import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import shortid from "shortid";
import {User} from "./user";
import {ChatMessage} from "./chatMessage";
import {JobOffer} from "./jobOffer";

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

    static async getBetween(workerId: string, offerId: string) {
        let conversation = await Conversation.findOne({where: {workerId, offerId}});
        if (!conversation) conversation = await this.createBetween(workerId, offerId);
        return conversation;
    }

    private static async createBetween(workerId: string, jobOfferId: string) {
        const conversation = Conversation.create({workerId, jobOfferId});
        await conversation.save();
        return conversation;
    }
}
