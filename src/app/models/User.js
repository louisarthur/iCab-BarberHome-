import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // campo que nunca irá existir na base de dados, só no código
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        // a principio não coloquei um avatar_id aqui para relacionar, então irei fazer um negócio diferente
        // relacionar o model de usar com o model de file
      },
      {
        sequelize,
      }
    ); // trechos de códigos executados de forma automatica baseado em ações que acontece no model
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  // fazendo a relação file, com o user, para usar o avatar_id
  // a chave (coluna) para ser associada aos users
  // também é necessário alterar no index.js na parte de models(map)
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // comparação do bcrpy da senha recebida e a senha hash do banco de dados
  ChecarSenha(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
