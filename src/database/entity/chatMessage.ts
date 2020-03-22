import {BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import shortid from "shortid";
import {Conversation} from "./conversation";
import {User} from "./user";
import {IChatMessage} from "../../types/api";

@Entity()
export class ChatMessage extends BaseEntity {
    @PrimaryColumn()
    id: string = shortid();

    @Column()
    conversationId: string;

    @ManyToOne(type => Conversation, c => c.messages)
    @JoinColumn()
    conversation: Promise<Conversation>;

    @Column()
    message: string;

    @Column()
    authorId: string;

    @ManyToOne(type => User)
    @JoinColumn()
    author: Promise<User>;

    @Column({type: "bigint"})
    createdAt: number = Date.now();

    toIChatMessage() {
        return {
            id: this.id,
            conversationId: this.conversationId,
            message: this.message,
            createdAt: this.createdAt
        } as IChatMessage
    }
}
