require('reflect-metadata');
import 'source-map-support/register'
import express from 'express'
import fs from 'fs'

import {initializeDatabase} from "./database/database";
import {environmentVariables} from './config/environment.config';
import path from "path";
import {validateFirebaseIdToken} from "./middleware/auth.middleware";


export const app = express();
export const router = express.Router();
const port = 3000;

//async boot
(async () => {
    console.log('📝 Initializing Database!');
    await initializeDatabase();

    //import all handlers
    const handlers = fs.readdirSync(path.resolve(__filename, "../handler/"));
    for (let key in handlers) {
        const handlerName = handlers[key];
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
    app.use(validateFirebaseIdToken);
    app.use('/api/v1', router);
    app.use(((req: express.Request, res: express.Response) => {
        res.status(404).send({
            error: "Not found"
        })
    }));

<<<<<<< HEAD
=======
    let port = environmentVariables.appPort;
>>>>>>> ca714cb018291c27d2bb545dcc90cf01546560f4
    app.listen(port, () => {
        console.log(`🚀 Server started at http://localhost:${port}`);
    });
})();
