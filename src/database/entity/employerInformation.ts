import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, OneToOne, OneToMany, ManyToOne} from "typeorm";
import shortid from 'shortid';
import {User} from "./user";
import {IJobOffer, IEmployerInformation} from "../../types/api/api";
import { JobOffer } from "./jobOffer";

@Entity()
export class EmployerInformation extends BaseEntity {
    @PrimaryColumn()
    id: string = shortid();

    @OneToOne(type => User, user => user.employerInformation)
    user: Promise<User>;

    @Column({ nullable: false })
    employerInformationId: number;

    @ManyToOne(type => JobOffer, offer => offer.employer)
    @Column()
    jobOffers: Promise<JobOffer[]>;

    async toIWorkerInformation(): Promise<IEmployerInformation> {
        return {
            id: this.id
        } as IEmployerInformation;
    }
}