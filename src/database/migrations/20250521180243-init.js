const TABLES = {
  USERS: 'users',
  LINKS: 'links',
  LINK_RULES: 'link_rules',
};

const LENGTH_CHAR = 255;

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(TABLES.USERS, {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        type: Sequelize.STRING(LENGTH_CHAR),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(LENGTH_CHAR),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(LENGTH_CHAR),
        allowNull: false,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
      },
      deleted_at: {
        type: 'TIMESTAMP',
      },
    }, { transaction });

    await queryInterface.createTable(TABLES.LINKS, {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      link: {
        type: Sequelize.STRING(LENGTH_CHAR),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
      },
      deleted_at: {
        type: 'TIMESTAMP',
      },
    }, { transaction });

    await queryInterface.createTable(TABLES.LINK_RULES, {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      link_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: TABLES.LINKS,
            schema: 'public',
          },
          key: 'id',
        },
      },
      rule: {
        type: Sequelize.JSON,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
      },
      deleted_at: {
        type: 'TIMESTAMP',
      },
    }, { transaction });
  }),

  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable(TABLES.USERS, { transaction });
    await queryInterface.dropTable(TABLES.LINK_RULES, { transaction });
    await queryInterface.dropTable(TABLES.LINKS, { transaction });
  }),
};
