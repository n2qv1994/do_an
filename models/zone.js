'use strict';
module.exports = function(sequelize, DataTypes) {
  var Zone = sequelize.define('Zone', {
    room_name: DataTypes.STRING,
    http: DataTypes.INTEGER,
    peer: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Zone;
};