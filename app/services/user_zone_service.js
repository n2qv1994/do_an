var zone_helper     = require("../helpers/zone_helper.js");
var user_helper		= require("../helpers/user_helper.js");
var user_zone_helper		= require("../helpers/user_zone_helper.js");
var Utils           = require("../utils/utils");

var User_Zone_Services = {

};

User_Zone_Services.add_relation = function(user, room_name) {
	if(user) {
		zone_helper.find_zone(room_name)
		.then(function(message) {
		    var zone = message.data;	
	   		user_zone_helper.find_relation(user.id, zone.id)
	   		.then(function(message) {
	   			var relation = message.data;
	   			if(!relation) {
	   				user_zone_helper.add_relation(user.id, zone.id);
	   			}	
	   			else {
	   				console.log("*** relation existed***");
	   			}
	   		})
	   		.catch(function(message_error) {
				Utils.log(message_error.error);
	   		});
		})
		 .catch(function(message_error) {
		    Utils.log(message_error.error);
		});
	}
	else {
		console.log("*** Not found user for add relationship***")
	}
};

module.exports = User_Zone_Services;