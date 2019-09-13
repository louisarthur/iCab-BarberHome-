import { Router } from 'express';
import Multer from 'multer';
import multerConfiguracao from './config/multer';

import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProvidersController from './app/controllers/ProvidersController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import AutHMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = Multer(multerConfiguracao);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionsController.store);
// Uso do middleware de forma global, para as rotas que vinherem depois desse routes.use()
routes.use(AutHMiddleware);

routes.put('/users', UserController.update);
// .single para fazer um upload de arquivo por vez, file é o campo para requisição, alô imsomnia/postman
// o multer cria uma váriavel na req chamada req.file
routes.get('/providers', ProvidersController.index);
routes.get('/providers/:idProvider/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.delete('/appointments/:id', AppointmentController.delete);

// index dos providrs
routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
// vai receber um id da notificação
routes.put('/notifications/:id', NotificationController.update);

routes.post('/file', upload.single('file'), FileController.store);
export default routes;
