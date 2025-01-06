'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('handbook_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      handbookId:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      headingVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      headingEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentHTMLVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentHTMLEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentMarkdownVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentMarkdownEn: {
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
    await queryInterface.dropTable('handbook_contents');
  }
};