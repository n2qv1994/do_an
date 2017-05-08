/**
 * Created by spider on 8/23/15.
 */
function PeerStats(options) {

    this.options = options;

    this.total_peer_stats = {
        size: 0,//byte
        download_count: 0,
        download_time: 0,//ms
        prepare: 0//ms
    };

    this.total_http_stats = {
        size: 0,//byte
        download_count: 0,
        download_time: 1,//ms
        prepare: 1//ms
    };

    this.stats = {
        total_http:0,
        total_http_prepare:0,

        http:0,
        http_prepare:0,

        total_peer: 0,
        total_peer_prepare:0,

        peer:0,
        peer_prepare:0,
    }

    var self = this;
    self.clear();

    this.clear_interval = setInterval(function(){
        self.calc();
        console.log("Stats:", self.getStats());
        self.clear();
    }, this.options.measure_time);
}

PeerStats.prototype.clear = function(){
    this.peer_stats = {
        size: 0,//byte
        download_count: 0,
        download_time: 0,//ms
        prepare_time: 0//ms
    };

    this.http_stats = {
        size: 0,//byte
        download_count: 0,
        download_time: 0,//ms
        prepare_time: 0//ms
    };
}

PeerStats.prototype.add = function(type, size, download_time, prepare_time){
    if(type == 'http'){
        this.total_http_stats.download_count += 1;
        this.total_http_stats.size += size;
        this.total_http_stats.download_time += download_time;
        this.total_http_stats.prepare_time += prepare_time;

        this.http_stats.download_count += 1;
        this.http_stats.size += size;
        this.http_stats.download_time += download_time;
        this.http_stats.prepare_time += prepare_time;

        var serverBar = document.getElementById("serverBar");  
        serverBar.style.width = this.total_http_stats.download_count + '%'; 
        serverBar.innerHTML = this.total_http_stats.download_count * 1  + ' package';
    }

    if(type == 'peer'){
        this.total_peer_stats.download_count += 1;
        this.total_peer_stats.size += size;
        this.total_peer_stats.download_time += download_time;
        this.total_peer_stats.prepare_time += prepare_time;

        this.peer_stats.download_count += 1;
        this.peer_stats.size += size;
        this.peer_stats.download_time += download_time;
        this.peer_stats.prepare_time += prepare_time;

        var peerBar = document.getElementById("peerBar");  
        peerBar.style.width = this.total_peer_stats.download_count + '%'; 
        peerBar.innerHTML = this.total_peer_stats.download_count * 1  + ' package';
    }
};

PeerStats.prototype.calc = function(){
    //for HTTP
    var total_http_speed = 0;
    var total_http_prepare = 0;

    var http_speed = 0;
    var http_prepare = 0;

    if(this.total_http_stats.download_time > 0) {
        total_http_speed = this.total_http_stats.size / this.total_http_stats.download_time;
        total_http_prepare = this.total_http_stats.prepare_time / this.total_http_stats.download_count;
    }

    if(this.http_stats.download_time > 0){
        http_speed = this.http_stats.size / this.http_stats.download_time;
        http_prepare = this.http_stats.prepare_time / this.http_stats.download_count;
    }

    this.stats.total_http = Math.floor(total_http_speed);
    this.stats.total_http_prepare = Math.floor(total_http_prepare);

    this.stats.http = Math.floor(http_speed);
    this.stats.http_prepare = Math.floor(http_prepare);

    //for PEER
    var total_peer_speed = 0;
    var total_peer_prepare = 0;

    var peer_speed = 0;
    var peer_prepare = 0;

    if(this.total_peer_stats.download_time > 0) {
        total_peer_speed = this.total_peer_stats.size / this.total_peer_stats.download_time;
        total_peer_prepare = this.total_peer_stats.prepare_time / this.total_peer_stats.download_count;
    }

    if(this.peer_stats.download_time > 0){
        peer_speed = this.peer_stats.size / this.peer_stats.download_time;
        peer_prepare = this.peer_stats.prepare_time / this.download_count;
    }

    this.stats.total_peer = Math.floor(total_peer_speed);
    this.stats.total_peer_prepare = Math.floor(total_peer_prepare);

    this.stats.peer = Math.floor(peer_speed);
    this.stats.peer_prepare = Math.floor(peer_prepare);
};

PeerStats.prototype.getStats = function(){
    return this.stats;
};
