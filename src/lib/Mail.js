import Nodemailer from 'nodemailer';
import { resolve, dirname } from 'path';
// templates engine frameworks
import exphbs from 'express-handlebars';
import nodeexphbs from 'nodemailer-express-handlebars';
import { isThursday } from 'date-fns';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // desestruturei o mailconfig
    const { host, port, secure, auth } = mailConfig;
    // o transporter é do nodemailer
    // tá transportando para o nodemailer
    this.transporter = Nodemailer.createTransport({
      host,
      port,
      secure,
      // se o usuário não tiver na autenticação, passe nulo
      auth: auth.user ? auth : null,
    });
    // chamando o método abaixo
    this.configTemplates();
  }

  configTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // o use é para adicionar uma configuração a mais ao transporter
    // o compile do nodemailer é como ele compila os templates de email, como ele formata as mensagens,
    // o nodemailer express handbars trabalha em cima do compile, mostrandio os templates de email
    this.transporter.use(
      'compile',
      nodeexphbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // método para envio de email
  sendMail(message) {
    // nativamente o nodemailer tem o sendmail, entretanto não chamei direto,
    // pois defini a variavél remetente padrão
    // enviando o default - remetente e message pelo send email
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
