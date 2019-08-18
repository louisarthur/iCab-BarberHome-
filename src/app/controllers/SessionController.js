import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authorization from '../../config/auth';

class SessionController {
  async store(req, res) {
    // yup para garantir que vai vir um email e uma senha, obrigatóriamente.
    const scheme = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await scheme.isValid(req.body))) {
      return res.status(400).json({ error: 'válidação falha' });
    }
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
