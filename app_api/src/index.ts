import './database/database';
import * as dotenv from "dotenv";
import server from './server';

dotenv.config();

const port = process.env.PORT ?? 3003;

server.listen(port, () => console.log(`Server online on port ${port}`));