/**
 * Created by spider on 8/20/15.
 */

function PeerCDN(options) {
    this.options = options;
    this.socket  = null;
}

PeerCDN.prototype.connect = function(server_url){
    console.log("Will connect to " + server_url);
    this.socket = io.connect(
        server_url,
        {
            query:{
                room_id:'room_1',
                key:'aaaaaa'
            },
            forceNew:true,
            upgrade: false,
            transports: ['websocket']
        }
    );

    this.started = false;
    this.peer_cache = new PeerCacheSizeLimit(this.options);
    this.peer_history = new PeerHistory(this.socket);
    this.peer_manager = new PeerManager(this.socket, this.options, this.peer_history);
    this.peer_resource = new PeerResource(this.peer_manager, this.peer_cache, this.options);
    this.peer_stats = new PeerStats({measure_time: 5000});

    this.peer_manager.setListener($.proxy(this.onPeerEvent, this));
};

PeerCDN.prototype.onPeerEvent = function(event, data){
    if(event == 'subscriber'){
        this.peer_resource.addSubscriberPeer(data);
    }else if(event == 'started'){
        this.started = true;
    }
};

PeerCDN.prototype.isStarted = function(){
    return this.started;
};

PeerCDN.prototype.request = function(resource_id, callback){
    var self = this;
    var start_time = Date.now();
    this.peer_resource.request(resource_id, function(data, type, peer_id){
        var end_time = Date.now();
        var speed = data.byteLength / (end_time - start_time);
        console.log("Download------ " + resource_id + " ---size:" + (data.byteLength / 1024) + "---kB speed:" + speed + "---kB/s by " + type);
        self.peer_stats.add(type, data.byteLength,end_time - start_time, 10, peer_id, self.socket);
        if(type == "peer") {
            $("#list_peer_id").append('<li>'+peer_id+'</li>');
            self.emit("increase_point", peer_id);
        }
        if(callback) callback(data);
    });
};

PeerCDN.prototype.on = function(event, callback) {
   this.socket.on(event, function(data) {
        callback(data)
   });
};

PeerCDN.prototype.emit = function(event, data) {
    this.socket.emit(event, data);
};