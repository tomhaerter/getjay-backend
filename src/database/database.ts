import {createConnection, ConnectionOptions} from 'typeorm';
import {Connection} from "typeorm/connection/Connection";
import { environmentVariables } from '../config/environment.config';

export let connection: Connection;
export const initializeDatabase = async () => {
    const options: ConnectionOptions = {
        type: "postgres",
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
        console.log('✔️ Connection to Database established.')

    } catch (error) {
        console.log('❌ Error: Could not connect to Database');
        console.log(error);
    }
};
