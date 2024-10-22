'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Referal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor_Referal.belongsTo(models.User, {foreignKey:'doctorId'})
    }
  };
  Doctor_Referal.init({
    contentHTMLVi:DataTypes.TEXT('long'),
    contentMarkdownVi: DataTypes.TEXT('long'),
    contentHTMLEn:DataTypes.TEXT('long'),
    contentMarkdownEn: DataTypes.TEXT('long'),
    descriptionVi:DataTypes.TEXT('long'),
    descriptionEn:DataTypes.TEXT('long'),
    doctorId: DataTypes.INTEGER,
   
  }, {
    sequelize,
    modelName: 'Doctor_Referal',
  });
  return Doctor_Referal;
};