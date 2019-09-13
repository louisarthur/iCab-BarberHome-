import User from '../models/User';
import Notification from '../schema/Notification';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!isProvider) {
      return res.status(400).json({
        error: 'Somente fornecedores de serviço podem ver notificações',
      });
    }
    // Como não é o sequelize no postgres, é o mongodb, usaremos no mongoose dessa forma, para buscar
    // no banco de dados.
    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    // ele vai receber o id da notificação
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      // vai dar o update em read
      {
        read: true,
      },
      // retornar o read para o usuário
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
