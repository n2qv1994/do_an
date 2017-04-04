var models = require("../../models");
var Q      = require("q");
var Utils  = require("../utils/utils");
var Friend_Helper = {

};

Friend_Helper.find_all_friend = function(user_id) {
	var message = {};
  	var deferred = Q.defer();
	models.Friend.findAndCountAll({
		where: { 
			friend_id: user_id,
		}
  	})
  	.then(function(friends) {
    	message.data = friends;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      	console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

Friend_Helper.find_user = function(user_id) {
	var message = {};
  	var deferred = Q.defer();
	models.Friend.findAndCountAll({
		where: { 
			user_id: user_id,
		}
  	})
  	.then(function(users) {
    	message.data = users;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      	console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

//find one friend
Friend_Helper.find_friend = function(user_id, friend_id) {
	var message = {};
  	var deferred = Q.defer();
	models.Friend.find({
		where: { 
			user_id: user_id,
			friend_id: friend_id 
		}
  	})
  	.then(function(friend) {
    	message.data = friend;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      	console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

Friend_Helper.add_friend = function(user_id, friend_id) {
	models.Friend.build({
	    user_id: user_id,
	    friend_id: friend_id,
	    score: 1,
	    status:"online",
	    isFriend:0
 	})
	.save()
	.then(function(result) {
		console.log("*** add friend success**");
	})
	.catch(function(error) {		
		console.log("*** save friend false ***");
		console.log(error);
	});
};

Friend_Helper.update_score = function(friend) {
	friend.score++;
	friend.update({
	   score: friend.score
	})
	.then(function(friend_update) {
	   console.log("**** update friend'score success ****");
	})
	.catch(function(error) {
	   console.log("**** update friend'score false ****");
	   console.log(error);
	});
};

Friend_Helper.update_friend_status = function(friends, status) {
	for( var i = 0; i < friends.count; i ++) {
		friends.rows[i].update({
		   status: status
		})
		.then(function(friend_update) {
		   console.log("**** update friend'status success ****");
		})
		.catch(function(error) {
		   console.log("**** update friend'status false ****");
		   console.log(error);
		});
	}
};

Friend_Helper.upgrade_to_friend = function(users) {
	for( var i = 0; i < users.count; i ++) {
		if(users.rows[i].score > 200) {
			users.rows[i].update({
		    	isFriend: 1
			})
			.then(function(friend_update) {
			   console.log("**** upgrade to friend success ****");
			})
			.catch(function(error) {
			   console.log("**** upgrade to friend false ****");
			   console.log(error);
			});
		}
	}
};

Friend_Helper.get_friend = function(user_id) {
	var message = {};
  	var deferred = Q.defer();
	models.Friend.findAndCountAll({
		where: { 
			user_id: user_id,
			status: "online",
			isFriend: 1
		}
  	})
  	.then(function(friends) {
    	message.data = friends;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      	console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

module.exports = Friend_Helper;