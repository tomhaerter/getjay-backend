import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn, RemoveOptions, OneToOne, JoinColumn} from "typeorm";
import * as firebaseAdmin from "firebase-admin";
import Firebase from "../../services/firebase";
import {JobOffer} from "./jobOffer";
import {IOwnUser, IUser} from "../../types/api";
import { EmployerInformation } from "./employerInformation";
import { WorkerInformation } from "./workerInformation";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({nullable: true})
    name?: string;

    @Column()
    email: string;

    @ManyToMany(type => JobOffer, jobOffer => jobOffer.usersBookmarked)
    @JoinTable()
    bookmarkedJobOffers: Promise<JobOffer[]>;

    @OneToOne(type => EmployerInformation, employerInformation => employerInformation.user)
    @JoinColumn()
    employerInformation?: Promise<EmployerInformation>;

    @OneToOne(type => WorkerInformation, workerInformation => workerInformation.user)
    @JoinColumn()
    workerInformation?: Promise<WorkerInformation>;

    async getFirebaseUser() {
        return Firebase.getInstance().admin.auth().getUser(this.id);
    }

    async remove(options?: RemoveOptions): Promise<this> {
        Firebase.getInstance().admin.auth().deleteUser(this.id);
        return super.remove(options)
    }

    async toIOwnUser(): Promise<IOwnUser> {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        } as IOwnUser
    }

    async toIUser(): Promise<IUser> {
        return {
            id: this.id,
            name: this.name
        } as IUser
    }

    /**
     * Adds a job offer to the bookmarked job offers of this user
     * @param jobOffer The job offer to be added to the bookmarked job offers of this user
     */
    async bookmarkJobOffer(jobOffer: JobOffer) {
        (await this.bookmarkedJobOffers).push(jobOffer);
        return this.save();
    }

    /**
     * @returns true, when user is an employer, otherwise false
     */
    async isEmployer(): Promise<boolean> {
        return true;
    }

    /**
     * @returns true, when user is a worker, otherwise false
     */
    async isWorker(): Promise<boolean> {
        return true;
    }

    /**
     * Creates a User instance from an existing firebase user.
     * The information stored in the firebase user are copied to the new User instance.
     * @param firebaseToken The existing firebase user the new instance is created off of.
     */
    static async registerFirebaseUser(firebaseToken: firebaseAdmin.auth.DecodedIdToken) {
        const u = new User();
        u.id = firebaseToken.uid;

        const firebaseUser = await u.getFirebaseUser();
        u.name = firebaseUser.displayName;
        u.email = firebaseUser.email;

        await u.save();
        return u;
    }
}
