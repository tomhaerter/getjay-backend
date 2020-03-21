import {NextFunction, Request, Response} from "express";
import {authRouter} from "../index";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
    if (!req.firebaseUser)
        return res.status(401).send({error: "Access Denied"});
    next();
}

