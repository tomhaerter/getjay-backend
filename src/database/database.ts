import {createConnection} from 'typeorm';
import {Connection} from "typeorm/connection/Connection";

export let connection: Connection;
export const initializeDatabase = async () => {
    connection = await createConnection();
};
