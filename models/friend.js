'use strict';
module.exports = function(sequelize, DataTypes) {
  var Friend = sequelize.define('Friend', {
    user_id: DataTypes.INTEGER,
    friend_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    status: DataTypes.STRING,
    isFriend: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Friend;
};