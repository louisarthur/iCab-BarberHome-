import jwt from 'jsonwebtoken';
import User from '../models/User';
import authorization from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.ChecarSenha(password))) {
      res.status(401).json({ error: 'Senha incorreta' });
    }
    const { id, name } = user;
    return res.json({
      user: { id, name, email },
      // umahashparacriptagemdogobarber
      token: jwt.sign({ id }, authorization.secret, {
        expiresIn: authorization.expiresIn,
      }),
    });
  }
}

export default new SessionController();
