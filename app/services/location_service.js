var location_helper     = require("../helpers/location_helper.js");
var user_helper     = require("../helpers/user_helper");
var Utils           = require("../utils/utils");

var Location_Services = {

};

Location_Services.add_location = function(user, info) {
    if(user) {
     	location_helper.find_user_location(user.id, info.longitude, info.latitude)
     	.then(function(message) {
     		var location = message.data;
     		if(!location) {	
     			info.user_id = user.id;
     			location_helper.add_location(info);
     		}
     	})
     	.catch(function(message_error) {
     		Utils.log(message_error.error);
     	})
    }
    else {
      console.log("*** Not found user for add location ***");
    }
};

module.exports = Location_Services;