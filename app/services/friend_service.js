var friend_helper     = require("../helpers/friend_helper.js");
var user_helper     = require("../helpers/user_helper.js");
var Utils           = require("../utils/utils");

var Friend_Services = {

};

Friend_Services.update_score = function(receiver_id, sender_id) {
	friend_helper.find_friend(receiver_id, sender_id)
	.then(function(message) {
		var friend = message.data;
		if(!friend) {
			friend_helper.add_friend(receiver_id, sender_id);
		}
		else {
			friend_helper.update_score(friend);
		}
	})
	.catch(function(message_error) {
		Utils.log(message_error.error);
	});		    	
};

Friend_Services.update_status = function(user, status) {
    if(user) {
      friend_helper.find_all_friend(user.id)
      .then(function(message) {
      	var friends = message.data;
      	if(friends) {
      		friend_helper.update_friend_status(friends, status);
      	}
      	else {
      		console.log("*** is't friend ***");
      	}
      })
      .catch(function(message_error) {
      	Utils.log(message_error.error);
      });
    }
    else {
      console.log("*** Not found user for update status ***");
    }
};

Friend_Services.upgrade_to_friend = function(user) {
	if(user) {
		friend_helper.find_user(user.id)
		.then(function(message) {
			var users = message.data;
			friend_helper.upgrade_to_friend(users);
		})
		.catch(function(message_error) {
			Utils.log(message_error.error);
		});
	}
	else {
		console.log("*** Not found user ***");
	}
};

Friend_Services.get_friend = function(user_id, number_friend, callback) {
	friend_helper.get_friend(user_id, number_friend)
	.then(function(message) {
		var friends = message.data;
		var list_id = [];
		console.log("*** get friends success ***");
		if(friends.count <= number_friend) {
			for(var i = 0; i < friends.count; i ++) {
				list_id.push(friends.rows[i].friend_id);
			}
			return callback(false, list_id);
		}
		else {
			friends.rows.sort(function(friend_1, friend_2) {
				if (friend_1.score < friend_2.score)
				    return 1;
				if (friend_1.score > friend_2.score)
				    return -1;
				return 0;
			});
			for(var i = 0; i < number_friend; i++) {
				list_id.push(friends.rows[i].friend_id);
			};
			return callback(false, list_id);
		}
	})
	.catch(function(message_error) {
		console.log("*** get friends error ***");
		console.log(message_error);
		return callback(true, null);
	});
};

module.exports = Friend_Services;