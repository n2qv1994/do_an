/**
 * Created by spider on 8/20/15.
 */

function PeerContainer(peer_id, username, origin, socket){
    this.peer_id = peer_id;
    this.socket = socket;
    this.origin = origin;
    this.username = username;
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
    create: function (peer_id, username, origin, socket) {
        return new PeerContainer(peer_id, username, origin, socket);
    }
}