import Sequelize, { Model } from 'sequelize';

class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        // vai gerar o user_id e provider_id igual como gerou o avatar_id na users, fazendo associação
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  // uma coisa interessante do sequelize, é que quando uma tabela tem mais de uma
  // relação com a outra, é obrigatório usar codinomes (as)
  // é necessário fazer essa associação pois estamos utilizando da vantagem de ter um banco
  // relacional
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}
export default Appointments;
