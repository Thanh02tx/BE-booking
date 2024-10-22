'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Handbook_Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      Handbook_Content.belongsTo(models.Handbook, { foreignKey: 'handbookId' });

    
    }
  };
  Handbook_Content.init({
    handbookId: DataTypes.INTEGER,
    headingVi: DataTypes.STRING,
    headingEn:DataTypes.STRING,
    contentHTMLVi:DataTypes.TEXT,
    contentHTMLEn:DataTypes.TEXT,
    contentMarkdownVi:DataTypes.TEXT,
    contentMarkdownEn:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Handbook_Content',
  });
  return Handbook_Content;
};
