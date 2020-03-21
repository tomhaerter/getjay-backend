import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";
import shortid from "shortid";
import {User} from "./user";
import {IJobOffer} from "../../types/api/api";

@Entity()
export class JobOffer extends BaseEntity {
    @PrimaryColumn()
    id: string = shortid();

    @Column("text", {array: true})
    categories: Category[];

    @Column("text", {array: true})
    workdays: Workdays[];

    @Column()
    payment: number;

    @ManyToMany(type => User, user => user.bookmarkedJobOffers)
    usersBookmarked: Promise<User[]>;

    @Column()
    description: string;

    @Column("text", {array: true})
    requirements: string[];

    @Column()
    geoHash: string;

    @Column()
    from: number;

    @Column()
    to: number;

    @Column()
    image: string;

    toIJobOffer() {
        return {
            id: this.id,
            categories: this.categories,
            workdays: this.workdays,
            payment: this.payment,
            description: this.description,
            requirements: this.requirements,
            geoHash: this.geoHash,
            from: this.from,
            to: this.to,
            image: this.image
        } as IJobOffer
    }
}

export enum Category {
    OTHER,
    FARMING,
    HOSPITAL,
    CARE,
    LOGISTICS
}

export enum Workdays {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}
