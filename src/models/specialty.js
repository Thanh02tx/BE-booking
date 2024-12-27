'use strict';
const {
  Model
} = require('sequelize');
const doctor_infor = require('./doctor_infor');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId' });
    }
  };
  Specialty.init({
    nameVi: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    descriptionHTMLEn: DataTypes.TEXT,
    descriptionHTMLVi: DataTypes.TEXT,
    descriptionMarkdownVi:DataTypes.TEXT,
    descriptionMarkdownEn:DataTypes.TEXT,
    image: DataTypes.TEXT,
    
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};