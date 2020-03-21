import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn, OneToOne} from "typeorm";
import shortid from 'shortid';
import {User} from "./user";
import {IJobOffer, IWorkerInformation} from "../../types/api";

@Entity()
export class WorkerInformation extends BaseEntity {
    @PrimaryColumn()
    id: string = shortid();

    @OneToOne(type => User, user => user.workerInformation)
    user: Promise<User>;

    @Column({ nullable: false })
    workerInformationId: number;

    async toIWorkerInformation(): Promise<IWorkerInformation> {
        return {
            id: this.id
        } as IWorkerInformation;
    }
}
