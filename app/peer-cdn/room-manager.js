/**
 * Created by spider on 8/20/15.
 */
var PeerContainer = require('./peer-container.js');
var nodeproxy = require('nodeproxy');
var user_service = require("../services/user_services.js");
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var event = new EventEmitter2();

function RoomManager(room_id, _config){
    console.log("Created RoomManager:" + room_id);
    this.room_id = room_id;
    this.peer_mapper = {};
    this.config = _config;
    // this.list_user = null;
}
RoomManager.prototype.bestPeersForPeer = function(peer_id, callback){
    var self = this;
    user_service.get_best_peers(function(usernames) {
        var peer_mapper = self.peer_mapper;
        var list_peer_id_return = [];
        // console.log("****** perr_mapper **********")
        // console.log(peer_mapper);
        // console.log("***********best user ************");
        // console.log(usernames);
        // var all = Object.keys(peer_mapper);
        // var index = all.indexOf(peer_id);
        // if (index > -1) {
        //     all.splice(index, 1);
        // }
        // console.log("****************all**********************");
        // console.log(all);
        // console.log(typeof all);
       
        for(var id_peer_mapper in peer_mapper) {
            for(var i = 0; i < usernames.length; i++) {
                if(peer_mapper[id_peer_mapper].username === usernames[i]) {
                    if(peer_mapper[id_peer_mapper].peer_id !== peer_id) {
                        list_peer_id_return.push(peer_mapper[id_peer_mapper].peer_id);
                    }                   
                }
            }
        }
        // console.log("***************list peer id return****************");
        // console.log(list_peer_id_return);
        // console.log(typeof list_peer_id_return);
         // return callback(all);
        return callback(list_peer_id_return);
    });
};

RoomManager.prototype.addPeer = function(peer_id, username, origin, socket){
    console.log("Adding peer:", peer_id);
    var self = this; 
    var peer = PeerContainer.create(peer_id, username, origin, socket);
    this.peer_mapper[peer_id] = peer;

    //reg event listener
    peer.on('update-peer', nodeproxy(this.onPeerUpdateRequest, this));

    peer.on('disconnect', nodeproxy(this.onPeerClose, this));

    //init data to sending to peer
    this.bestPeersForPeer(peer_id, function(list_peer_id_return) {
        // console.log("************peer prepare********************");
        // console.log(list_peer_id_return);
        peer.emit('prepare-peer', {
            peer_host : self.config.peer_host,
            peer_port : self.config.peer_port,
            peer_path : self.config.peer_path,
            peer_id : peer_id,
            peers : list_peer_id_return,
            max_peer : self.config.max_peer,
            min_peer : self.config.min_peer,
            timeout_peer : self.config.timeout_peer
        });
    });
};

RoomManager.prototype.onPeerClose = function(peer){
    //do some thing when peer close
    console.log("Closing peer:", peer.peer_id);

    delete this.peer_mapper[peer.peer_id];
};

RoomManager.prototype.onPeerUpdateRequest = function(peer, data, callback){
    console.log("Update peers request:", peer.peer_id);
    this.bestPeersForPeer(peer.peer_id, function(list_peer_id_return) {
        // console.log("*********peer update*********************");
        //  console.log(list_peer_id_return);
        peer.emit('update-peer', {
            peers: list_peer_id_return
        });
    });
};
// RoomManager.prototype.update_list_user = function(list_user){
//     return this.list_user = list_user;
// };

module.exports = {
    create: function (room_id, config) {
        return new RoomManager(room_id, config);
    }
};