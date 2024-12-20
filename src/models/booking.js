'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Booking.belongsTo(models.User, {foreignKey:'patientId',targetKey:'id',as:'patientData'})
      Booking.belongsTo(models.Patient_Record, { foreignKey: 'patientId' });
      Booking.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
      Booking.belongsTo(models.Allcode, {foreignKey:'statusId',targetKey:'keyMap',as:'statusData'})
      Booking.hasOne(models.History, {foreignKey: 'idBooking'});
    }
  };
  Booking.init({
    statusId: DataTypes.STRING,
    scheduleId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    reason:DataTypes.STRING,
    token:DataTypes.STRING,
    note:DataTypes.TEXT

  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};