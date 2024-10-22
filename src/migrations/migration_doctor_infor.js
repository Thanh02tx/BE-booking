'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctor_infor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      specialtyId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      clinicId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      priceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentHTMLVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentMarkdownVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentHTMLEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentMarkdownEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descriptionVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descriptionEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      noteVi: {
        allowNull: false,
        type: Sequelize.STRING
      },
      noteEn: {
        allowNull: false,
        type: Sequelize.STRING
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('doctor_infor');
  }
};