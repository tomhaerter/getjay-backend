import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn, RemoveOptions, OneToOne, JoinColumn} from "typeorm";
import * as firebaseAdmin from "firebase-admin";
import Firebase from "../../services/firebase";
import {JobOffer} from "./jobOffer";
import {IOwnUser, IUser} from "../../types/api";
import { EmployerInformation } from "./employerInformation";
import { WorkerInformation } from "./workerInformation";
import jobOffer from "../../handler/jobOffer";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @ManyToMany(type => JobOffer, jobOffer => jobOffer.usersBookmarked)
    @JoinTable()
    bookmarkedJobOffers: Promise<JobOffer[]>;

    @ManyToMany(type => JobOffer, jobOffer => jobOffer.usersAccepted)
    @JoinTable()
    acceptedJobOffers: Promise<JobOffer[]>;

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
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        } as IOwnUser
    }

    async toIUser(): Promise<IUser> {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
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

    async unBookmarkJobOffer(jobOffer: JobOffer) {
        const bookmarkedJobOffers = await this.bookmarkedJobOffers;
        this.bookmarkedJobOffers = Promise.resolve(bookmarkedJobOffers.filter(a => a.id !== jobOffer.id));
        return this.save();
    }

    /**
     * Adds a job offer to the list of accepted job offers
      * @param jobOffer
     */
    async acceptJobOffer(jobOffer: JobOffer) {
        (await this.acceptedJobOffers).push(jobOffer);
        return this.save();
    }

    /**
     * Removes a job offer to the list of accepted job offers
     * @param jobOffer
     */
    async rejectJobOffer(jobOffer: JobOffer) {
        const jobOffers = await this.acceptedJobOffers;
        this.acceptedJobOffers = Promise.resolve(jobOffers.filter(a => a.id !== jobOffer.id));
        return this.save();
    }

    /**
     * @returns true, when user is an employer, otherwise false
     */
    async isEmployer(): Promise<boolean> {
        //todo set false
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
        const name = firebaseUser.displayName.split(" ");
        u.firstName = name[0];
        u.lastName = firebaseUser.displayName.split(" ").slice(1).join(" ");
        u.email = firebaseUser.email;

        await u.save();
        return u;
    }
}
