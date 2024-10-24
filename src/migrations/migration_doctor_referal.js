'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctor_referals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentHTMLVi: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentMarkdownVi:{
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentHTMLEn: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentMarkdownEn:{
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      descriptionVi:{
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      descriptionEn:{
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      doctorId:{
        allowNull: true,
        type: Sequelize.INTEGER
      },
      specialtyId:{
        allowNull: true,
        type: Sequelize.INTEGER
      },
      clinicId:{
        allowNull: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('doctor_referals');
  }
};