const TABLES = {
  LINKS: 'links'
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLES.LINKS, 'strategy', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'is_active'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(TABLES.LINKS, 'strategy');
  }
};
