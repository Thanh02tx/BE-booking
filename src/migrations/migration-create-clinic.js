'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clinics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      address:{
        allowNull: false,
        type: Sequelize.STRING
      },
      addressMap:{
        allowNull: false,
        type: Sequelize.TEXT
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
      provinceId:{
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('clinics');
  }
};