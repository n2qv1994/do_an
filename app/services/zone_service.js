var zone_helper     = require("../helpers/zone_helper.js");
var Utils           = require("../utils/utils");

var Zone_Services = {

};

Zone_Services.add_zone = function(room_name) {
	zone_helper.find_zone(room_name)
	.then(function(message) {
	    var zone = message.data;
	    if(!zone) {    
	     	zone_helper.add_zone(room_name);
	    }
	    else {
	      console.log("*** zone existed ***");
	    }
	 })
	 .catch(function(message_error) {
	    Utils.log(message_error.error);
	 });
};

module.exports = Zone_Services;