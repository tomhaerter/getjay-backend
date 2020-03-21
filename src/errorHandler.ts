import {RequestHandler} from "express";

export const wrap = (fn: Function): RequestHandler => {
    return (req, res) => {
        const handleError = (e: Error) => {
            if (isHttpError(e)) {
                return res.status(e.code).send({error: e.message})
            }
            if (isEntityNotFoundError(e)) {
                return res.status(404).send({error: e.message})
            }
            console.error(e);
            res.status(500).send({error: "Internal Error"})
        };

        Promise.resolve(fn(req, res)).catch(handleError).then(returnValue => {
            if (!returnValue) return res.json();
            Promise.resolve(returnValue).catch(handleError).then(val => {
                //if server response was returned
                try {
                    if (val.__proto__.app.name === 'app') {
                        return;
                    }
                } catch (e) {}

                res.json(val)
            });
        })
    }
};


function isHttpError(obj: any): obj is HttpError {
    return !!(obj as HttpError).code
}

function isEntityNotFoundError(obj: any): obj is HttpNotFoundError {
    return obj.name === "EntityNotFound";
}
interface HttpError extends Error {
    code: number;
}


export class HttpBadRequestError extends Error {
    code = 400;
    name = "BadRequest";
}

export class HttpForbiddenError extends Error {
    code = 403;
    name = "Forbidden";
}

export class HttpNotFoundError extends Error {
    code = 404;
    name = "NotFound";
}


