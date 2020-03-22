import cors from 'cors';
import {app} from "../index";

const origins = ['localhost', 'localhost:3000', 'localhost:3001', 'getjay.fourfive.studio'];

export function registerCors() {
    const corsMiddleware = cors({
        origin: function (origin, next) {
            if (origins.indexOf(origin) !== -1 || !origin) {
                next(null, true)
            } else {
                next(new Error("Not allowed!"))
            }
        }
    });
    app.use(corsMiddleware);
    app.options('*', corsMiddleware)
}
