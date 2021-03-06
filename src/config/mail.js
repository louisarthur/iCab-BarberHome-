export default {
  // smpt é o procotolo de envio de email, e prexisa de host, dar uma lida.
  host: process.env.MAIL.HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    // usando esse default pois é comum a todo email, e vou usar no mail
    from: 'iCab TEAM <noreply>@icab.com>',
  },
};
// para se utilziar do serviço de envio de e-mail
// utiliza-se um fornecedor de serviço
// comummente é utilizado o Amazon SES
// existe tbm: emailgun, sparkpost e mandril (mainchimp)
// não é interessante utilizar o gmail pois ele contém um limite

// utilizaremos o mailtrap, pois é para dev, só funciona para dev!!!
