import {devSeed} from "./database/seeds/devSeed";

require('reflect-metadata');
import 'source-map-support/register'
import express from 'express'
import fs from 'fs'

import {initializeDatabase} from "./database/database";
import {environmentVariables} from './config/environment.config';
import path from "path";
import {checkAuthHeader} from "./middleware/auth.middleware";
import {startRepl} from "./repl";
import {authGuard} from "./middleware/authGuard.middleware";


export const app = express();
export const router = express.Router();
export const authRouter = express.Router();


//async boot
(async () => {
    console.log('📝 Initializing Database!');
    await initializeDatabase();

    if (process.env.NODE_ENV === 'development') {
        await devSeed()
    }

    authRouter.use(authGuard);

    //import all handlers
    const handlers = fs.readdirSync(path.resolve(__filename, "../handler/"));
    for (let key in handlers) {
        const handlerName = handlers[key];
        //make sure file ends with .js
        if (!/^.*\.js$/.test(handlerName)) {
            continue;
        }

        const filePath = path.resolve(__filename, "../handler/", handlerName);
        const handlerFile = require(filePath);

        try {
            //try to initialize the handler
            const handler = new handlerFile.default();
            await handler.initialize();
            console.log(`Initialized ${handler.__proto__.constructor.name}`);
        } catch (e) {
            console.error(e);
        }
    }

    //add router to express
    app.use(checkAuthHeader);

    app.use('/api/v1', authRouter);

    app.use('/api/v1', router);
    app.use(((req: express.Request, res: express.Response) => {
        res.status(404).send({
            error: "Not found"
        })
    }));

    const port = environmentVariables.appPort;
    app.listen(port, () => {
        console.log(`🚀 Server started at http://localhost:${port}`);
        startRepl().then()
    });


})();
