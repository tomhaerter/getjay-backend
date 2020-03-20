import {RequestHandler} from "express";

export const wrap = (fn: Function): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res)).catch(e => {
                console.error(e);
                res.status(500).send({error: "Internal Error"})
            }
        )
    }
};
