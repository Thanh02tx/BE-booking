'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  
    History.belongsTo(models.Booking, {foreignKey: 'idBooking'});
    }
  };
  History.init({
    idBooking:DataTypes.INTEGER,
    imageResult:DataTypes.TEXT,
    doctorRating: DataTypes.INTEGER,
    waitingTimeRating: DataTypes.INTEGER,
    facilityRating : DataTypes.INTEGER,
    staffRating :DataTypes.INTEGER,
    comments: DataTypes.TEXT,
    status:DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};