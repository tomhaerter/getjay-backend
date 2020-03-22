import cors from 'cors';
import {app} from "../index";


export function registerCors() {
    const corsMiddleware = cors({
        origin: process.env.NODE_ENV === 'production' ? 'https://getjay.fourfive.studio' : ['localhost', 'localhost:3000', 'localhost:3001'],
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Authorization', 'content-type'],
    });

    app.use(corsMiddleware);
    app.options('*', corsMiddleware)
}
