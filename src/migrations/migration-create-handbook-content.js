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
        type: Sequelize.INTEGER
      },
      headingVi: {
        type: Sequelize.STRING
      },
      headingEn: {
        type: Sequelize.STRING
      },
      contentHTMLVi: {
        type: Sequelize.TEXT
      },
      contentHTMLEn: {
        type: Sequelize.TEXT
      },
      contentMarkdownVi: {
        type: Sequelize.TEXT
      },
      contentMarkdownEn: {
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