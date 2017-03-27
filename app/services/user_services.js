var user_helper     = require("../helpers/user_helper");
// var bcrypt          = require("bcrypt");
var Utils           = require("../utils/utils");
var config          = require('../../config/config');

var status = {
  online: 0,
  offline: 1,
  busy: -1
};

var User_Services = {

};

User_Services.login = function(user_info, callback) {
  
  user_helper.find_by_name(user_info.username)
  .then(function(message) {
    var user = message.data;
    if(!user) {
      return callback(true, {data: "Not found user", status_code: 404, status: "error"});
    }
    else {
      if(user_info.password === user.password) {
        return callback(false, {data: user, status_code: 200, status: "success"});
      }
      else {
        return callback(true, {data: "password's not correct", status_code: 401, status: "failed"});
      }
    }
  })
  .catch(function(message_error) {
    Utils.log(message_error.error);
    return callback(true, {data: message_error.error, status_code: 500, status: "error"});
  });
};

User_Services.update_point = function(username) {
  user_helper.update_point(username)
  .then(function(message) {
    var status = message.data;
    console.log(status);
  })
  .catch(function(error) {
    console.log(error);

  });
};

User_Services.update_status = function(username, status) {
  user_helper.update_status(username, status)
  .then(function(message) {
    var status = message.data;
    console.log(status);
  })
  .catch(function(error) {
    console.log(error);

  });
};

User_Services.get_best_peers = function(callback) {
  user_helper.get_best_peers()
  .then(function(message) {
    var usernames = message.data;
    console.log("************service****************");
    console.log(usernames);
    return callback(usernames);
  })
  .catch(function(error) {
    console.log(error);

  });
};

module.exports = User_Services;
