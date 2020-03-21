import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";
import * as firebaseAdmin from "firebase-admin";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string;

    static async registerFirebaseUser(firebaseUser: firebaseAdmin.auth.DecodedIdToken) {
        const u = new User();
        u.id = firebaseUser.uid;
        return u;
    }
}
