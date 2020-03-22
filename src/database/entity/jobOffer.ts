import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, OneToOne, JoinColumn, OneToMany} from "typeorm";
import shortid from 'shortid';
import {User} from "./user";
import {IJobOffer} from "../../types/api";
import { EmployerInformation } from "./employerInformation";

@Entity()
export class JobOffer extends BaseEntity implements IJobOffer {
    @PrimaryColumn()
    id: string = shortid();

    @Column()
    title: string;

    @Column("text", {array: true})
    categories: Category[];

    @Column("text", {array: true})
    workdays: Workdays[];

    /**
     * Hourly payment
     */
    @Column()
    payment: number;

    @ManyToMany(type => User, user => user.bookmarkedJobOffers)
    usersBookmarked: Promise<User[]>;

    @ManyToMany(type => User, user => user.acceptedJobOffers)
    usersAccepted: Promise<User[]>;

    @Column()
    description: string;

    @Column("text", {array: true, nullable: true})
    requirements?: string[];

    /**
     * The geohash of the location this job offer
     */
    @Column()
    geoHash: string;

    /**
     * Start time of the job in minutes from 0 am.
     */
    @Column()
    from: number;

    /**
     * End time of the job in minutes from 0 am.
     */
    @Column()
    to: number;

    @Column({nullable: true})
    imageURI?: string;

    @OneToMany(type => EmployerInformation, info => info.jobOffers)
    @JoinColumn()
    employer: Promise<EmployerInformation>;

    @Column({nullable: false})
    employerId: string;

    toIJobOffer() {
        return {
            id: this.id,
            title: this.title,
            categories: this.categories,
            workdays: this.workdays,
            payment: this.payment,
            description: this.description,
            requirements: this.requirements,
            geoHash: this.geoHash,
            from: this.from,
            to: this.to,
            imageURI: this.imageURI
        } as IJobOffer
    }

    /**
     * Creates a new job offer and saves it in the database
     * @param jobOffer The job offer
     */
    static async createJobOffer(jobOffer: IJobOffer): Promise<JobOffer> {
        const j = JobOffer.create(jobOffer);
        await j.save();
        return j;
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
