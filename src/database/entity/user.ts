import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn, RemoveOptions} from "typeorm";
import * as firebaseAdmin from "firebase-admin";
import Firebase from "../../services/firebase";
import {JobOffer} from "./jobOffer";
import {IOwnUser, IUser} from "../../types/api/api";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @ManyToMany(type => JobOffer, jobOffer => jobOffer.usersBookmarked)
    @JoinTable()
    bookmarkedJobOffers: Promise<JobOffer[]>;

    async getFirebaseUser() {
        return Firebase.getInstance().admin.auth().getUser(this.id);
    }

    async remove(options?: RemoveOptions): Promise<this> {
        //TODO Delete firebase user
        return super.remove(options)
    }

    async toIOwnUser() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        } as IOwnUser
    }

    async toIUser() {
        return {
            id: this.id,
            name: this.name
        } as IUser
    }

    async bookmarkJobOffer(jobOffer: JobOffer) {
        (await this.bookmarkedJobOffers).push(jobOffer);
        return this.save();
    }

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
