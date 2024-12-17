'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcode.hasMany(models.Booking,{foreignKey:'statusId',as:'statusData'})
       Allcode.hasMany(models.Doctor_Infor,{foreignKey:'positionId',as:'positionData'})
       Allcode.hasMany(models.Doctor_Infor,{foreignKey:'gender',as:'genderData'})
       Allcode.hasMany(models.Schedule,{foreignKey:'timeType',as:'timeTypeData'})
       Allcode.hasMany(models.Patient_Record,{foreignKey:'gender',as:'genderPatient'})
       Allcode.hasMany(models.Doctor_Infor,{foreignKey:'priceId',as:'priceTypeData'})
       Allcode.hasMany(models.Doctor_Infor,{foreignKey:'paymentId',as:'paymentTypeData'})
       Allcode.hasMany(models.Clinic,{foreignKey:'provinceId',as:'provinceData'})
       Allcode.hasMany(models.Patient_Record,{foreignKey:'relationship',as:'relationshipTypeData'})
      }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};