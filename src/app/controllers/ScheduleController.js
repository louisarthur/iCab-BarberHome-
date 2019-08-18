// Criação dessa classe para os providers, a gente precisa fomentar para eles,
// a agenda
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointments';
import User from '../models/User';
// importando o operador do sequelize para usar no between

class ScheduleController {
  async index(req, res) {
    const checagemProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checagemProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não é fornecedor de serviço' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // vamos fazer uma operação between no banco de dados, para isso, importamos o op sequelize
        // e iremos fazer assim: para retornar o dia todo, pegaremos o horário do começo do dia 00:00
        // e o horário do final do dia para fazer essa analise, para isso também importaremos a biblioteca
        // date-fns somente os modulos startofDay,endofDay e ParseISO
        // ex: 2019-08-20 00:00:00
        //    2019-08-20 23:59:59
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);

    // where provider:true,user_id:userId
  }
}

export default new ScheduleController();
