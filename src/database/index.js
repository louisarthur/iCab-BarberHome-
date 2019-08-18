// faz a conexão entre o database e aplicação (models)
import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/Files';
import Appointments from '../app/models/Appointments';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      // básicamente, o que estarei fazendo aqui é chamar o método associate através do map, e..
      // usando o && é um if condicional, informando que só chame se o model tiver o método, e depois faço a conexão
      .map(model => model.associate && model.associate(this.connection.models));
  }

  // conectando com o mongo, por padrão o docker não gera o mongo com usuário e senha
  mongo() {
    this.mongoConnection = Mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
