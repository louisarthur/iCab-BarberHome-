// Essa migration foi criada pois as migrations funcionam como a linha do tempo de nossa aplicação
// e são modificadas de acordo com a necessidade, não adicionei o campo direto na migration de users
// pois iria ficar confuso referenciar os files com users, por isso, criei essa migration para
// criar um campo de avatar_id nos users.

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      // nome da tabela
      'users',
      // nome da coluna
      'avatar_id',
      // agora informações sobre o avatar id
      {
        // interger pois vai ser refenciado somente o id da file
        type: Sequelize.INTEGER,
        // a tabela a ser referenciada e o que vai ser colocado no avatar_id, files e id
        references: { model: 'files', key: 'id' },
        // quando for atualizado o avatar id, vai atualizar simultaneamente na tabela de users, não somente na file
        onUpdate: 'CASCADE',
        // quando o avatar id for deletado, o campo ficará null
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
