import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        // só existe pra a gente!!
        // é um método do tipo virtual e através do metodo get, enviará a respectiva
        // file-avatar do usuário
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // para vizualizar a URL o usuário precisa enviar o token e para isso,
            // vamos em app.js e vamos utilizar o express.static, para usar arquivos staticos
            // usado do middleware
            return `http://localhost:3333/file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
export default File;
