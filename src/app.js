import express from 'express';
import routes from './routes';
import './database';
/* criando como classe e fazendo a mesma coisa do exercicios primario, entretanto, modularizando e fazendo por classes */
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
