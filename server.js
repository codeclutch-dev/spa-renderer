import * as dotenv from 'dotenv';
import Server from "./classes/Server.js";

dotenv.config();

const server = new Server();
server.start();
server.listen();

