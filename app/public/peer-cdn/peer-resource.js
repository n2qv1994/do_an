/**
 * Created by spider on 8/21/15.
 */

function PeerResource(peer_manager, peer_cache, options) {
    this.peer_manager = peer_manager;
    this.peer_cache = peer_cache;
    this.options = options;
    this.downloading_mapper = {};
}

PeerResource.prototype.request = function(resource_id, callback){
    if(this.peer_cache.check(resource_id)){
        // callback(this.peer_cache.get(resource_id));
        callback(this.peer_cache.get(resource_id),'my_data',"my_id");
        return;
    }

    var peers = this.peer_manager.peer_mapper;
    var has_data = false;
    var self = this;
    var timeout = Object.keys(peers).length > 0 ? 500 : 1;

    console.log("Requesting:" + resource_id + " peers:" +  timeout);

    var peer_timeout = setTimeout(function(){
        console.log("Requesting peer timeout" );
        if(!has_data){
            has_data = true;
            self.downloadHttp(resource_id, callback);
        }
    }, timeout);

    var number_request = Object.keys(peers).length;
    for (var peer_id in peers) {
        if (peers.hasOwnProperty(peer_id)){ //???
            var peer = peers[peer_id];
            console.log("Requesting peer data:", peer_id);
            peer.request(
                'check-request',
                {
                    resource_id: resource_id
                },
                function(response){
                    number_request--;
                    console.log("Requesting peer data response", response);
                    if(has_data == false && response.status == true){
                        console.log("   ->accept");
                        clearTimeout(peer_timeout);
                        has_data = true;
                        self.downloadPeer(peer, resource_id, callback);
                    }else{
                        console.log("   ->reject");
                        if(number_request == 0){
                            console.log("All peer no data -> using http" );
                            clearTimeout(peer_timeout);
                            has_data = true;
                            self.downloadHttp(resource_id, callback);
                        }
                    }
                }
            );
        }
    }
};

PeerResource.prototype.addSubscriberPeer = function(peer){
    //we need to listen all request from this peer
    peer.onRequest('check-request', $.proxy(this.onCheckRequest, this));
    peer.onRequest('download-request', $.proxy(this.onDownRequest, this));
};

PeerResource.prototype.onCheckRequest = function(type, params, callback){
    var resource_id = params.resource_id;
    var has = this.peer_cache.check(resource_id) || this.isDownloading(resource_id, 'http');
    console.log("[Uploading] Checking " + resource_id + " -> " + has, this.downloading_mapper);

    callback({status: has});
};

PeerResource.prototype.onDownRequest = function(type, params, callback){
    var resource_id = params.resource_id;
    var has = this.peer_cache.check(resource_id);
    if(has){
        console.log("[Uploading] Sending " + resource_id + " -> " + has);

        callback({status: has, data: this.peer_cache.get(resource_id)});
    }else if(this.isDownloading(resource_id, 'http')){
        console.log("[Uploading] Waiting download then sending " + resource_id);
        this.addDownloadedCallback(resource_id, function(data){
            console.log("[Uploading] Sending " + resource_id);
            callback({status: true, data: data});
        });
    }
};

//For downloading resource utils
PeerResource.prototype.addDownloading = function(resource_id, type){
    if(this.downloading_mapper.hasOwnProperty(resource_id)){
        this.downloading_mapper[resource_id].type = type;//update type when re-download
    }else {
        this.downloading_mapper[resource_id] = {
            type: type,
            callbacks: []
        };
    }
    console.log("Downloading: added" + resource_id, this.downloading_mapper);
};

PeerResource.prototype.addDownloadedCallback = function(resource_id, callback){
    console.log("Downloading: added callback for " + resource_id);
    if(this.downloading_mapper.hasOwnProperty(resource_id)){
        this.downloading_mapper[resource_id].callbacks.push(callback);
    }
};

PeerResource.prototype.isDownloading = function(resource_id, type){
    var is_downloading = this.downloading_mapper.hasOwnProperty(resource_id);
    console.log("Downloading: is downloading" + resource_id + " -> " + is_downloading, this.downloading_mapper);
    return is_downloading;
};

PeerResource.prototype.setDownloaded = function(resource_id, arrayBuffer){
    // console.log("Downloading: removed " + resource_id);
    // var callbacks = this.downloading_mapper[resource_id].callbacks;
    // for(var i = 0; i < callbacks.length; i++){
    //     callbacks[i](arrayBuffer);
    // }
    // delete this.downloading_mapper[resource_id];
    if( this.downloading_mapper[resource_id] !== undefined) { //n2qv
        var callbacks = this.downloading_mapper[resource_id].callbacks;
        for(var i = 0; i < callbacks.length; i++){
            callbacks[i](arrayBuffer);
        }
        delete this.downloading_mapper[resource_id];     
    }
};
//end of downloading resource utils

PeerResource.prototype.downloadHttp = function(resource_id, callback){
    this.addDownloading(resource_id, 'http');

    console.log("Download " + resource_id + " by http");
    var self = this;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", resource_id, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        if (arrayBuffer) {
            callback(arrayBuffer, 'http', 'http');
            self.peer_cache.cache(resource_id, arrayBuffer);

            self.setDownloaded(resource_id, arrayBuffer);
        }
    };

    oReq.send(null);
};

PeerResource.prototype.downloadPeer = function(peer, resource_id, callback){
    this.addDownloading(resource_id, 'peer');

    var self = this;
    console.log("Download " + resource_id + " by peer");
    peer.request(
        'download-request',
        {
            resource_id: resource_id
        }, function (data) {
            if(data != null && data.status == true){
                callback(data.data, 'peer', peer.peer_id);
                self.peer_cache.cache(resource_id, data.data);

                self.setDownloaded(resource_id);
            }else{
                self.downloadHttp(resource_id, callback);
            }
        }
    );
};