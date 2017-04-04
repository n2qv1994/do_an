var models = require("../../models");
var Q      = require("q");
var Utils  = require("../utils/utils");
var user_helper = require("./user_helper.js");
var Location_Helper = {

};

Location_Helper.find_user_location = function(user_id, longitude, latitude) {
	var message = {};
  var deferred = Q.defer();
	models.Location.find({
		where: { 
			user_id: user_id,
			longitude: longitude,
			latitude: latitude 
		}
  	})
  	.then(function(location) {
    	message.data = location;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

Location_Helper.add_location = function(info) {
	models.Location.build({
	    user_id: info.user_id,
	    longitude: info.longitude,
	    latitude: info.latitude,
	    city: info.city,
	    region: info.region,
	    country: info.country
 	})
  	.save()
  	.then(function(result) {
  		console.log("*** add_location success ***");
  	})
  	.catch(function(error) {		
  		console.log("*** save info false ***");
  		console.log(error);
  	});
};

module.exports = Location_Helper;