import User from '../models/User';
import File from '../models/Files';

// control criado para fazer a listagem dos fornecedores do serviço
class ProviderController {
  async index(req, res) {
    // a busca do findAll usa o where, poiis é a línguagem do banco de dados
    // passando sem o atributes, a gente consegue perceber que retorna coisas que não é necessário
    // como senha e outras coisas.
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // é necessário retornar os dados do avatar_id
      include: [
        {
          model: File,
          as: 'avatar',
          // atributes é necessário para fazer a filtragem de mais alguns dados, sem ele
          // estava retornando dados que não eram necessários
          attributes: ['name', 'path', 'url'],
          // não
        },
      ],
      // retornnado somente o file, fica esquisito, pois retorna mts dados sobre o file
      // e não a URL, para isso iremos no model de user e no associate iremos dar um codinome
      // no foreignkey
    });
    return res.json(providers);
  }
}

export default new ProviderController();
