'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient_Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   Patient_Record.belongsTo(models.Allcode, {foreignKey:'provinceId',targetKey:'keyMap',as:'provinceData'})
      Patient_Record.hasMany(models.Booking, { foreignKey: 'patientId' })
      Patient_Record.belongsTo(models.Allcode, {foreignKey:'relationship',targetKey:'keyMap',as:'relationshipTypeData'})
    }
  };
  Patient_Record.init({
    idAccount:DataTypes.INTEGER,
    firstName:DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    bhyt: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    districtId: DataTypes.STRING,
    wardId: DataTypes.STRING,
    address:DataTypes.STRING,
    gender:DataTypes.STRING,
    relationship:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Patient_Record',
  });
  return Patient_Record;
};