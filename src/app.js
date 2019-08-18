import express from 'express';
import path from 'path';
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
    // para receber requisiçÕes em Json
    this.server.use(express.json());
    // para acessar o arquivo de forma fácil no frontend
    this.server.use(
      '/file',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
