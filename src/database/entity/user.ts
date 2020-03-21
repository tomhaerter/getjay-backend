import {BaseEntity, Column, Entity, PrimaryColumn, RemoveOptions} from "typeorm";
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

    async remove(options?: RemoveOptions): Promise<this> {
        //TODO Delete firebase user
        return super.remove(options)
    }

}
