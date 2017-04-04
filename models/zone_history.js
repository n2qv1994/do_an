'use strict';
module.exports = function(sequelize, DataTypes) {
  var Zone_History = sequelize.define('Zone_History', {
    zone_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Zone_History;
};