import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointments';
// o front end vai ter um timer pick, então o horário vai vir no formato timeStamp
// EX: 1568327918271
class AvailableController {
  async index(req, res) {
    // recebendo a data
    const { date } = req.query;
    // se a data for inexistente
    if (!date) {
      return res.status(400).json({ error: 'data inexistente.' });
    }
    // transformando a date em inteiro
    const searchDate = Number(date);
    // pegando do banco de dados, o prodider fornecido peloe params
    // se o agendanento não está candelado
    // e o appointment entre o começo do dia do search date
    // e o fim do dia do search date
    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.idProvider,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });
    // futuramente fazer esse timesavaible de outra forma, perguntando ao fornecedor de serviço
    // de que forma ela irá trabalhar, em relação ao horário.
    const timesAvaible = [
      '08:00', // é necessário criar as strings com a data igual a do banco de dados
      '09:00', // o formato igual o de lá.
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = timesAvaible.map(times => {
      const [hour, minute] = times.split(':');
      // o set seconds tá pegando uma data e setando o segundo como 0
      // o set minutes tá pegando a hora e setando o minute de acordo com o split
      // supracitado.
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      console.log('SET HOUR');
      console.log(setHours(searchDate, hour));
      console.log('SET MINUTE');
      console.log(setMinutes(setHours(searchDate, hour), minute));
      console.log('VALUE WITH SET SECONDS, THE ALL ACCOMPLISHMENT');
      console.log(value);
      // retornandio o objeto e formatando o value
      return {
        times,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        // agora verificaremos se esse horário está disponível
        // o isafter está verificando se o horário já passou do horário atual
        // vai encontrar nos apoitments filtrados lá em cima, os appointments que estão dentro do horário.
        disponibility:
          isAfter(value, new Date()) &&
          !appointment.find(appoint => format(appoint.date, 'HH:mm') === times),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
