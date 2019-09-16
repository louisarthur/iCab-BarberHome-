import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        // vai gerar o user_id e provider_id igual como gerou o avatar_id na users, fazendo associação
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // adicionarei algumas coisas para aparecer no front end, que irão ajudar
        past: {
          type: Sequelize.VIRTUAL,
          // verificando o passado
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancellable: {
          type: Sequelize.VIRTUAL,
          // verificado se se não é passado e se está a 3 horas antes.
          get() {
            return isBefore(new Date(), subHours(this.date, 3));
          },
        },
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
