import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EmailCancelamento {
  // get é usado para não se usar o constructor
  // e a gente ter acesso aos métodos rápido
  get key() {
    return 'EmailCancelamento';
  }

  async handle({ dados }) {
    const { appointment } = dados;
    // enviando o email, nome do provider e o email, para dizer que foi cancelado o appointment
    // irei adicionar template engines, para enviar email com o formato de html/ css
    // básicamente são arquivos html que recebem váriveis do node, e tem várias funcionalidades
    // a gente vai usar o handlebars, onde quero utilizar váriavéis a gente utilzia chaves
    // primeiro a gente utiliza o yarn add express-handlebars nodemailer-express-handlebars
    // view de template engine no email, lembrar do handlebars
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento foi cancelado',
      text: 'olá você possui uma desgraça de email',
      template: 'cancel',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
    // lembrar de pegar o format de armazenamento.
  }
}

export default new EmailCancelamento();
