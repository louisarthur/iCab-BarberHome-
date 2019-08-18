import * as Yup from 'yup';
/**
 * utilizarei o date-fns com os módulos start e parse para validação das datas
 * cada provider poderá ppegar um usuário a cada uma hora e só poderá ser armazenado
 * datas que são futuras, tudo isso é resolvido nas regras de négocio do aplicativo
 */
import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/Files';
import Appointment from '../models/Appointments';

class AppointmentController {
  async store(req, res) {
    // validação de dados
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validacão' });
    }
    const { provider_id, date } = req.body;

    /**
     * checar se o provider id é um provider real do banco de dados
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'O agendamento só é possível com fornecedores de serviço',
      });
    }
    /**
     * validando as regras de negócio, com o date-fns, usando as datas, parseIso- transforma
     * a string da data em um objeto date do javascript
     * e que poderá ser usado dentro do startofHour
     * o startaofHour- vai pegar a hora fechada ex: 19:30 = 19
     */
    const hourStart = startOfHour(parseISO(date));
    /**
     * agora irei verificar se a data é passada! ou é atual!
     * para isso usarei o método isBefore da data-fns, dê olhada na documentação
     * qualquer duvida, new Date() é a data atual que o js pega.
     */
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Datas do passado não são permitidas' });
    }

    const providerAvaibility = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (providerAvaibility) {
      return res.status(400).json({
        error: 'O horário indisponível para este fornecedor de serviço',
      });
    }

    /**
     * agora irei checar se o horário está vago
     */
    const createAndStore = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json(createAndStore);
  }

  async index(req, res) {
    // para o frontend, precisaremos fazer a paginação, pois é necessário limitar de 20 em 20
    // no req.query existe um atributo page, que no caso é para dizer qual página está
    // page = 1, é para padronizar
    const { page = 1 } = req.query;
    const AppointmentsList = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      // para retornar ordenado faremos um vector
      // retornando pela ordem da data
      order: ['date'],
      // filtrando para receber somente id e date
      attributes: ['id', 'date'],
      // limite de mostrar somente de 20 em 20
      limit: 20,
      // calculo de offset, lembre-se que o offset é complementado pelo pelo limit
      // ele só define o limite inferior
      offset: (page - 1) * 20,
      // incluindo para receber o id e o name do provider
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // incluindo para receber do file o avatar do provider, olhe no /model/file o pq eu tô pedindo o path
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        },
      ],
    });

    return res.json(AppointmentsList);
  }
}
export default new AppointmentController();
