'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idBooking: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      doctorRating: {
        type: Sequelize.INTEGER
      },
      waitingTimeRating: {
        type: Sequelize.INTEGER
      },
      facilityRating: {
        type: Sequelize.INTEGER
      },
      staffRating: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      comments: {
        type: Sequelize.TEXT
      },
      imageResult: {
        allowNull: false,
        type: Sequelize.BLOB('long')
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
    await queryInterface.dropTable('histories');
  }
};