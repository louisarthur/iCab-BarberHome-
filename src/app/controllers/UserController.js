import User from '../models/User';

class UserController {
  // criar o usuário
  async store(req, res) {
    const UserExists = await User.findOne({ where: { email: req.body.email } });
    if (UserExists) {
      return res.status(400).json({ Error: 'Email de usuário existente' });
    }
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // update do usuário
  async update(req, res) {
    const { email, oldPassword } = req.body;
    // primare key
    const user = await User.findByPk(req.userId);

    // se o usuário for mudar o email, tenho que verificar se o email já existe, então...
    if (email !== user.email) {
      const EmailExists = await User.findOne({ where: { email } });

      if (EmailExists) {
        return res.status(400).json({ error: 'Email de usuário em uso!' });
      }
    }
    // verificar a oldpassword, somente se for trocar a senha, informando o oldpassword
    if (oldPassword && !(await user.ChecarSenha(oldPassword))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    // trocando aqui!
    const { id, name, provider } = await user.update(req.body);
    // retornando as novas auterações
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
