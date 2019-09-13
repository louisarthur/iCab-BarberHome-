export default {
  // smpt é o procotolo de envio de email, e prexisa de host, dar uma lida.
  host: 'smtp.mailtrap.io',
  port: '2525',
  secure: false,
  auth: {
    user: '51d9786b9d43f9',
    pass: '88618219b2e227',
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
