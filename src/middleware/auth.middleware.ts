import {NextFunction, Request, Response} from "express";
import Firebase from '../services/firebase';
import {User} from "../database/entity/user";


export async function validateFirebaseIdToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization");

    if (!token) {
        return next();
    }

    try {
        req.firebaseUser = await Firebase.getInstance().admin.auth().verifyIdToken(token, true);
        req.getUser = async () => {
            let user = await User.findOne({id: req.firebaseUser.uid});
            if (!user) {
                user = await User.registerFirebaseUser(req.firebaseUser)
            }

            return user;
        }
    } catch (error) {

    }
    next();
}


