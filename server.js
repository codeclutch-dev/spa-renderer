import * as dotenv from 'dotenv';
import Server from './classes/Server.js';

dotenv.config();

const server = new Server({
  port: process.env.PORT,
  useCache: process.env.USE_CACHE === 'true',
  waitUntil: process.env.WAIT_UNTIL,
  spaUrl: process.env.SPA_URL,
});

server.start();
server.listen();
