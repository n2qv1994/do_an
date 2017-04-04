/**
 * Author: Nguyen Nho Quoc Viet
 * Helper: user_helper
 */

var models = require("../../models");
var Q      = require("q");
var Utils  = require("../utils/utils");

var User_Helper = {

};

User_Helper.find_by_username = function(username) {
  var message = {};
  var deferred = Q.defer();

  models.User.find({
    where: { username: username }
  })
  .then(function(user) {
    message.data = user;
    return deferred.resolve(message);
  })
  .catch(function(error) {
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};

User_Helper.update_score = function(user) {
  // user.point = user.point + 1;
  user.score++;

  user.update({
    score: user.score
  })
  .then(function(user_update) {
    console.log("update score success");
  })
  .catch(function(error) {
    console.log("update score false");
    console.log(error);
  });
};

User_Helper.update_status = function(user, status) {
  if(user) {
    user.update({
      status: status
    })
    .then(function(user_update) {
      console.log("*** update user'status success ***");
    })
    .catch(function(err) {
      console.log("*** update user'status false ***");
      console.log(err);
    });
  }
  else {
    console.log("*** user = null ***")
  }
};

User_Helper.get_best_peers = function() {
  var message = {};
  var deferred = Q.defer();

  models.User.findAndCountAll({
    where: {status: "online"}
  })
  .then(function(result) {
    if(result.count < 3) {
      var user = [];
      for(var i = 0; i < result.count; i ++) {
        user.push(result.rows[i].username);
      }
      // console.log("*****************Helper*********************");
      // console.log(user);
      message.data = user;
    }
    else {
      var users = result.rows;
      var user_0 = null;
      var user_1 = null;
      var user_2 = null;
      if(users[0].point >= users[1].point) {
        if(users[1].point >= users[2].point) {
          user_0 = users[0];
          user_1 = users[1];
          user_2 = users[2];
        }
        else if(users[0].point >= users[2].point) {
          user_0 = users[0];
          user_1 = users[2];
          user_2 = users[1];
        }
        else {
          user_0 = users[2];
          user_1 = users[0];
          user_2 = users[1];
        }
      }
      else {
        if(users[2].point >= users[1].point) {
          user_0 = users[2];
          user_1 = users[1];
          user_2 = users[0];
        }
        else if(users[0].point >= users[2].point) {
          user_0 = users[1];
          user_1 = users[0];
          user_2 = users[2];
        }
        else {
          user_0 = users[1];
          user_1 = users[2];
          user_2 = users[0];
        }
      }

      for( var i = 3; i < result.count; i++ ) {
        if(users[i].point >= user_0.point) {
          user_2 = user_1;
          user_1 = user_0;
          user_0 = users[i];
        }
        if(user_0.point > users[i].point >= user_1.point) {
          user_2 = user_1;
          user_1 = users[i];
        }
        if(user_1.point > users[i].point >= user_2.point) {
          user_2 = users[i];
        }
      }
      message.data = [user_0.username, user_1.username, user_2.username];
    }
    return deferred.resolve(message);
  })
  .catch(function(error) {
    console.log(error);
    message.error = error.message;
    return deferred.reject(message);
  });

  return deferred.promise;
};
module.exports = User_Helper;
