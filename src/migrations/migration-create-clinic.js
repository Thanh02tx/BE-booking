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
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB('long')
      },
      address:{
        type: Sequelize.STRING
      },
      addressMap:{
        type: Sequelize.TEXT
      },
      descriptionHTMLVi: {
        type: Sequelize.TEXT
      },
      descriptionMarkdownVi: {
        type: Sequelize.TEXT
      },
      descriptionHTMLEn: {
        type: Sequelize.TEXT
      },
      descriptionMarkdownEn: {
        type: Sequelize.TEXT
      },
      provinceId:{
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