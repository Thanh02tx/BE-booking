'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Comment.belongsTo(models.User, { foreignKey: 'userId' });
        Comment.hasMany(models.Comment, {foreignKey: 'parentId',as: 'replies',});
    
          // Mối quan hệ ngược lại: một bình luận trả lời có một bình luận cha
        Comment.belongsTo(models.Comment, {foreignKey: 'parentId',as: 'parentComment',});
    }
  };
  Comment.init({
    userId:DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    parentId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};