/**
 * Created by spider on 8/20/15.
 */

function PeerContainer(peer_id, user_id, origin, longitude, latitude, socket){
    this.peer_id = peer_id;
    this.socket = socket;
    this.origin = origin;
    this.longitude = longitude;
    this.latitude = latitude;
    this.user_id = user_id;
}

PeerContainer.prototype.emit = function(type, params, callback){
    console.log("Emiting to " + this.peer_id + ":" + type, params);
    this.socket.emit(type, params, callback);
};

PeerContainer.prototype.on = function(type, callback){
    var self = this;
    this.socket.on(type, function(data, response_callback){
        callback(self, data, response_callback);
    });
}

module.exports = {
    create: function (peer_id, user_id, origin,  longitude, latitude, socket) {
        return new PeerContainer(peer_id, user_id, origin,  longitude, latitude, socket);
    }
}