'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.belongsTo(models.Allcode, {foreignKey:'provinceId',targetKey:'keyMap',as:'provinceData'})
      Clinic.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId' })
    }
  };
  Clinic.init({
    name:DataTypes.STRING,
    address: DataTypes.STRING,
    addressMap: DataTypes.TEXT,
    descriptionMarkdownVi: DataTypes.TEXT,
    descriptionHTMLVi:DataTypes.TEXT,
    descriptionMarkdownEn: DataTypes.TEXT,
    descriptionHTMLEn:DataTypes.TEXT,
    image: DataTypes.TEXT,
    provinceId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};