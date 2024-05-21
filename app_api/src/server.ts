import * as app from 'express';
import userRoutes from './routes/userRoutes';
import regionRoutes from './routes/regionRoutes';
import authRoute from './routes/authRoute';
import celebrateError from './infra/handlers/celebrateError';

const server = app();

server.use(app.json());
server.use(userRoutes);
server.use(regionRoutes);
server.use(authRoute);
server.use(celebrateError);

export default server;
