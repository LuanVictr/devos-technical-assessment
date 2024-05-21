import * as app from 'express';
import { UserModel } from './models/models';
import userRoutes from './routes/userRoutes';
import celebrateError from './infra/handlers/celebrateError';

const server = app();

server.use(app.json());
server.use(userRoutes);
server.use(celebrateError);

export default server;
