// fazendo o import do dotenv, o dotenv vai fazer a mudança das váriavéis de
// ambiente, dê uma olhada no .env
// cada uma dessas variaveis ambientes do .env,
// irão ser colocadas numa variavel global do node chamada
// process.env
// e eu poderei acessar as variaveis por exemplo como: process.env.DB_HOST
import 'dotenv/config';

import express from 'express';
import path from 'path';
// o express-async error tem que vir antes das rotas.
// yarn add @sentry/node@5.6.2
// tratamento de exceções
// o youch trata melhor as msgs de erro para o desenvolvedor
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import SentryConfig from './config/sentry';
// o sentry não consegue captar erros quando os controllers utilizam async, ou seja,
// deveremos importar o express-async-error
import routes from './routes';
import './database';

/* criando como classe e fazendo a mesma coisa do exercicios primario, entretanto, modularizando e fazendo por classes */

class App {
  constructor() {
    this.server = express();
    // sentry config
    Sentry.init(SentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    // de acordo com a documentação do Sentryx
    this.server.use(Sentry.Handlers.requestHandler());
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
    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // cadastrando um novo middleware, para não ficar rodando aquele await no imsnomnia,
  // e tratar aquilo
  exceptionHandler() {
    // quando existe 4 parametros o express entende automaticamente, quando um middlware
    // recebe 4 parametros é um de erro.
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        // existe o toHTML tbm
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'problemas internos no servidor' });
    });
  }
}

export default new App().server;
