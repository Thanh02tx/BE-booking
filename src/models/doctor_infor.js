'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor_Infor.belongsTo(models.User, {foreignKey:'doctorId'})
      
      Doctor_Infor.belongsTo(models.Allcode, {foreignKey:'priceId',targetKey:'keyMap',as:'priceTypeData'})
      Doctor_Infor.belongsTo(models.Allcode, {foreignKey:'paymentId',targetKey:'keyMap',as:'paymentTypeData'})
      Doctor_Infor.belongsTo(models.Clinic, { foreignKey: 'clinicId' });

    
    }
  };
  Doctor_Infor.init({
    doctorId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    noteVi: DataTypes.STRING,
    noteEn: DataTypes.STRING,
    contentHTMLVi:DataTypes.TEXT('long'),
    contentMarkdownVi: DataTypes.TEXT('long'),
    contentHTMLEn:DataTypes.TEXT('long'),
    contentMarkdownEn: DataTypes.TEXT('long'),
    descriptionVi:DataTypes.TEXT('long'),
    descriptionEn:DataTypes.TEXT('long'),
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor_Infor',
    freezeTableName:true
  });
  return Doctor_Infor;
};