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
      positionId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      priceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      positionId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        allowNull: false,
        type: Sequelize.BLOB('long')
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentHTMLVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentMarkdownVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentHTMLEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      contentMarkdownEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      descriptionVi: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      descriptionEn: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      noteVi: {
        type: Sequelize.STRING
      },
      noteEn: {
        type: Sequelize.STRING
      },
      count: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
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