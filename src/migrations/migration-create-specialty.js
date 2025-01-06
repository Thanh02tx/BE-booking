'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('specialties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      nameVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nameEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descriptionHTMLVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      descriptionMarkdownVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      descriptionHTMLEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      descriptionMarkdownEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('specialties');
  }
};