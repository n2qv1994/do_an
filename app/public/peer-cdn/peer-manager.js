/**
 * Created by spider on 8/20/15.
 */
function PeerManager(socket, global_config, peer_history) {
    console.log("Created PeerManager for socket");
    var self = this;
    this.socket = socket;
    this.global_config = global_config;
    this.peer_history = peer_history;
    this.peer_mapper = {};
    this.friend_peer_mapper = {};
    this.socket.on('prepare-peer', $.proxy(this.onPrepare, this));
    this.socket.on('update-peer', $.proxy(this.onUpdatePeer, this));
    this.checking_peer_interval = setInterval(function(){
        if(self.countPeers() < self.global_config.min_peer){
            //sending request to server for request new peer
            self.socket.emit('update-peer', {});
        }
    }, 5000);
}

PeerManager.prototype.countPeers = function(){
    return Object.keys(this.peer_mapper).length;
};

PeerManager.prototype.countSubscribers = function(){
    return Object.keys(this.friend_peer_mapper).length;
};

PeerManager.prototype.onPrepare = function(data){
    console.log("Prepare peer data:", data);
    var peer_host = data.peer_host;
    var peer_port = data.peer_port;
    var peer_path = data.peer_path;
    var peer_id = data.peer_id;
    var peers = data.peers;
    this.global_config.max_peer = data.max_peer;
    this.global_config.min_peer = data.max_peer;
    this.global_config.timeout_peer = data.timeout_peer;

    //connect to peer
    var self = this;
    this.peer = new Peer(peer_id, {
        host: peer_host,
        port: peer_port,
        path: peer_path
    });

    this.peer.on('open', function(id) {
        console.log("Opened peer connection:", self);
        self.add(peers);
        if(this.listener) this.listener('started', {});
    });

    this.peer.on('connection', function(conn){ // n2qv
        if(conn !== null) {
            console.log("Opened new subscriber peer connection:" + conn);
            self.addSubscriber(conn);
            self.peer_history.add(conn);
            console.log(self.peer_history);
        }
        // console.log("Opened new subscriber peer connection:" + conn);
        // self.addSubscriber(conn);
        // this.peer_history.add(conn);
        // console.log(this.peer_history);
    })
};

PeerManager.prototype.onUpdatePeer = function(data){
    this.add(data.peers);
};

PeerManager.prototype.addSubscriber = function(conn) {
    var self = this;
    var peer_container = new PeerContainer(conn.peer, conn);
    this.friend_peer_mapper[conn.peer] = peer_container;
    peer_container.onClose(function () {
        self.removeSubscriber(conn.peer);
    });

    console.log("Added Subscriber:", this.friend_peer_mapper);
    if (this.listener) this.listener('subscriber', peer_container);
};

PeerManager.prototype.removeSubscriber = function(peer_id){
    if(this.listener) this.listener('unsubscriber', this.friend_peer_mapper[peer_id]);

    delete this.friend_peer_mapper[peer_id];
    console.log("Removed Subscriber:", this.friend_peer_mapper);
};

PeerManager.prototype.add = function(peers){
    console.log("Adding peers:", peers);
    for(var i = 0; i < peers.length; i++){
        if(!this.peer_mapper.hasOwnProperty(peers[i])){
            this.addOne(peers[i]);
        }
    }
};

PeerManager.prototype.update = function(peers){
    console.log("Updating peers:", peers);
    this.add(peers);
};

PeerManager.prototype.onPeerClose = function(peer_id){
    console.log("Closed peer:", peer_id);
    delete this.peer_mapper[peer_id];

    //sending request to server for request new peer
    var self = this;
    this.socket.emit('close-peer',{closed:peer_id}, function (response) {
        self.update(response.peers);
    });
};

PeerManager.prototype.addOne = function(peer_id){
    var conn = this.peer.connect(peer_id);
    if(conn != undefined){
        var peer_container = new PeerContainer(peer_id, conn);
        var self = this;
        peer_container.onClose(function(){
            self.onPeerClose(peer_id);
        });
        this.peer_mapper[peer_id] = peer_container;
    }
};

PeerManager.prototype.setListener = function (listener) {
    this.listener = listener;
};