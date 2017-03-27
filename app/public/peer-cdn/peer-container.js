/**
 * Created by spider on 8/20/15.
 */
function PeerContainer(peer_id, conn){
    var self = this;
    this.peer_id = peer_id;
    this.conn = conn;
    this.isActive = false;
    this.conn.on('open', function(){
        console.log("Opened P2P connection with:" + peer_id);
        self.isActive = true;
        self.ping();
    });

    this.conn.on('close', function(){
        console.log("On close..");
        self.requester.close();
        if(self.close_callback) self.close_callback();
    });

    this.requester = new PeerRequest(conn);

    this.onRequest('ping', function(type, data, response){
        response('pong');
    });
}

PeerContainer.prototype.ping = function(){
    this.request('ping', {}, function(response){
        console.log("Ping response:" + response);
    });
};

PeerContainer.prototype.active = function(){
    return this.isActive;
};

PeerContainer.prototype.request = function(type, params, callback){
    this.requester.request(type, params, callback);
};

PeerContainer.prototype.onRequest = function(type, callback){
    this.requester.on(type, callback);
};

PeerContainer.prototype.onClose = function(callback){
    this.close_callback = callback;
};