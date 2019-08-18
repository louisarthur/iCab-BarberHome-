import * as Yup from 'yup';
// o yut segue o schema validation, olhe a documentação bb.
import User from '../models/User';

class UserController {
  // criar o usuário
  async store(req, res) {
    // req.body é um objeto, por isso object, required, obrigatório
    // o scheme deixa tudo ok no backend, dados inválidos não serão colocados no sistema
    const scheme = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      // provider: Yup.bool().required(),
    });
    if (!(await scheme.isValid(req.body))) {
      return res.status(400).json({ error: 'válidação falha' });
    }
    const UserExists = await User.findOne({ where: { email: req.body.email } });
    if (UserExists) {
      return res.status(400).json({ error: 'Email de usuário existente' });
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
    const scheme = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        // one of -> possíveis valores, se referindo ao password
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      // provider: Yup.bool().required(),
    });
    if (!(await scheme.isValid(req.body))) {
      return res.status(400).json({ error: 'válidação falha' });
    }

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
