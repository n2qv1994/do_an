var models = require("../../models");
var Q      = require("q");
var Utils  = require("../utils/utils");
var Zone_Helper = {

};

Zone_Helper.find_zone = function(room_name) {
	var message = {};
  var deferred = Q.defer();
	models.Zone.find({
		where: { room_name: room_name }
  	})
  	.then(function(zone) {
    	message.data = zone;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

Zone_Helper.add_zone = function(room_name) {
	models.Zone.build({
	    room_name: room_name,
 	})
	.save()
	.then(function(result) {
		console.log("*** add zone success**");
	})
	.catch(function(error) {		
		console.log("*** save zone false ***");
		console.log(error);
	});
};

module.exports = Zone_Helper;