import * as app from 'express';
import userRoutes from './routes/userRoutes';
import regionRoutes from './routes/regionRoutes';
import celebrateError from './infra/handlers/celebrateError';

const server = app();

server.use(app.json());
server.use(userRoutes);
server.use(regionRoutes);
server.use(celebrateError);

export default server;
