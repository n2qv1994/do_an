var models = require("../../models");
var Q      = require("q");
var Utils  = require("../utils/utils");
var User_Zone_Helper = {

};

User_Zone_Helper.add_relation = function(user_id, zone_id) {
	models.User_Zone.build({
	    user_id: user_id,
	    zone_id: zone_id
 	})
	.save()
	.then(function(result) {
		console.log("*** add relation success**");
	})
	.catch(function(error) {		
		console.log("*** save relation false ***");
		console.log(error);
	});
};

User_Zone_Helper.find_relation = function(user_id, zone_id) {
	var message = {};
  	var deferred = Q.defer();
	models.User_Zone.find({
		where: { 
			user_id: user_id,
			zone_id: zone_id 
		}
  	})
  	.then(function(relation) {
    	message.data = relation;
    	return deferred.resolve(message);
  	})
  	.catch(function(error) {
      console.log(error);
    	message.error = error.message;
    	return deferred.reject(message);
  	});
  	return deferred.promise;
};

module.exports = User_Zone_Helper;