import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionController';
import AutHMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);
// Uso do middleware de forma global, para as rotas que vinherem depois desse routes.use()
routes.use(AutHMiddleware);
routes.put('/users', UserController.update);
export default routes;
