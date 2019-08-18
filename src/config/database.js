module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'GoBarber',
  define: {
    timestamps: true,
    // UserGroups = user_groups
    underscored: true,
    underscoredAll: true,
  },
};
