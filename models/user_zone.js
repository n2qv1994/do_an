'use strict';
module.exports = function(sequelize, DataTypes) {
  var User_Zone = sequelize.define('User_Zone', {
    user_id: DataTypes.INTEGER,
    zone_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User_Zone;
};