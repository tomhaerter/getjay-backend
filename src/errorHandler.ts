import {RequestHandler} from "express";

export const wrap = (fn: Function): RequestHandler => {
    return (req, res) => {
        const handleError = (e: Error) => {
            if (isHttpError(e)) {
                return res.status(e.code).send({error: e.message})
            }
            console.error(e);
            res.status(500).send({error: "Internal Error"})
        };

        Promise.resolve(fn(req, res)).catch(handleError).then(returnValue => {
            if (!returnValue) return res.json();
            Promise.resolve(returnValue).catch(handleError).then(val => {
                res.json(val)
            });
        })
    }
};


function isHttpError(obj: any): obj is HttpError {
    return !!(obj as HttpError).code
}

interface HttpError extends Error {
    code: number;
}


export class HttpBadRequestError extends Error {
    code = 400;
    name = "BadRequest";
}

export class HttpNotFoundError extends Error {
    code = 404;
    name = "NotFound";
}


