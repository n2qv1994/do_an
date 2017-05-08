/**
 * Created by spider on 8/20/15.
 */

function PeerRequest(peer) {
    this.peer = peer;
    this.request_mapper = {};
    this.callback_mapper = {};
    var self = this;

    this.peer.on('data', function(data){
        console.log("PeerMSG:", data);
        if(data.type == 'request'){
            self.request_mapper[data.data.type](data.data.type, data.data.params, function(response){
                self.answer(data.uuid, response);
            });
        }else if(data.type == 'response'){
            self.callback_mapper[data.uuid](data.response);
            delete self.request_mapper[data.uuid];
        }
    });
}

PeerRequest.prototype.guid = function(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

PeerRequest.prototype.request = function(type, params, callback){
    var uuid = this.guid();
    var msg = {
        type: 'request',
        uuid: uuid,
        data : {
            type: type,
            params: params
        }
    };

    this.callback_mapper[uuid] = callback;

    this.peer.send(msg); //???
};


PeerRequest.prototype.answer = function(uuid, response){
    var msg = {
        type: 'response',
        uuid: uuid,
        response: response
    };
    this.peer.send(msg);
};

PeerRequest.prototype.on = function(type, callback){
    this.request_mapper[type] = callback;
};

PeerRequest.prototype.close = function(){
    for(var uuid in this.callback_mapper){
        if(this.callback_mapper.hasOwnProperty(uuid)){
            this.callback_mapper[uuid](null);
        }
    }

    this.callback_mapper = [];
};