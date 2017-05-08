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
	    http: 0,
	    peer: 0
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

Zone_Helper.update_http_zone = function(zone) {
	zone.http++;
	zone.update({
	   http: zone.http
	})
	.then(function(friend_update) {
	   console.log("**** update zone'http success ****");
	})
	.catch(function(error) {
	   console.log("**** update zone'http false ****");
	   console.log(error);
	});
	
};

Zone_Helper.update_peer_zone = function(zone) {
	zone.peer++;
	zone.update({
	   peer: zone.peer
	})
	.then(function(friend_update) {
	   console.log("**** update zone'peer success ****");
	})
	.catch(function(error) {
	   console.log("**** update zone'peer false ****");
	   console.log(error);
	});
};

module.exports = Zone_Helper;