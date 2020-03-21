import {createConnection, ConnectionOptions} from 'typeorm';
import {Connection} from "typeorm/connection/Connection";
import { environmentVariables } from '../config/environment.config';

export let databaseOK = false;
export let connection: Connection;
export const initializeDatabase = async () => {
    console.log(environmentVariables.postgresHost);
    const options: ConnectionOptions = {
        type: "postgres",
        // url: `postgres://${environmentVariables.postgresUser}:${environmentVariables.postgresPassword}@${environmentVariables.postgresHost}/${environmentVariables.postgresDb}`,
        host: environmentVariables.postgresHost,
        port: Number(environmentVariables.postgresPort),
        username: environmentVariables.postgresUser,
        password: environmentVariables.postgresPassword,
        database: environmentVariables.postgresDb,
        entities: ["src/database/entities/**/*.ts"],
        synchronize: true,
    };

    try {
        connection = await createConnection(options);
        console.log('✔️ Connection to Database established.');
        databaseOK = true;

    } catch (error) {
        console.log('❌ Error: Could not connect to Database');
        console.log(error);
        databaseOK = false;
    }
};