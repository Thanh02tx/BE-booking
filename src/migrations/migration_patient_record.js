'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idAccount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bhyt: {
        type: Sequelize.STRING
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provinceId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      districtId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      wardId: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
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
    await queryInterface.dropTable('patient_records');
  }
};