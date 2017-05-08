/**
 * Created by spider on 8/20/15.
 */
var PeerContainer = require('./peer-container.js');
var nodeproxy = require('nodeproxy');
var user_service = require("../services/user_service.js");
var friend_service = require("../services/friend_service.js");
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
    var peer_mapper = self.peer_mapper;
    var user_id = peer_mapper[peer_id].user_id;;
    var number_friend = 5;
    var length_of_peers = 0;
    var same_origin = [];
    var small_distance = [];

    friend_service.get_friend(user_id, number_friend, function(err, friends_id) {
    //     if(!err) {
    //         var peer_id_return = [];
    //         if(friends_id.length == number_friend) {
    //             console.log("*** friend = "+number_friend+" ***");
    //             for(var _peer_id in peer_mapper) {
    //                 for(var i = 0; i < number_friend; i++) {
    //                     if(peer_mapper[_peer_id].user_id == friends_id[i]) {
    //                         peer_id_return.push(peer_mapper[_peer_id].peer_id);
    //                         // return;
    //                     }
    //                 }
    //             }
    //             console.log(peer_id_return); 
    //             return callback(peer_id_return);   
    //         }
    //         else if(friends_id.length < number_friend) {
    //             console.log("*** friend = "+ friends_id.length +" < "+number_friend+" ***");
    //             for(var _peer_id in peer_mapper) {
    //                 for(var i = 0; i < friends_id.length; i++) {
    //                     if(peer_mapper[_peer_id].user_id == friends_id[i]) {
    //                         peer_id_return.push(peer_mapper[_peer_id].peer_id);
    //                         // delete peer_mapper[_peer_id];
    //                     }
    //                 }
    //             };

    //             for(var _peer_id in peer_mapper) {
    //                  if(peer_mapper[peer_id].user_id !== peer_mapper[_peer_id].user_id) {
    //                     if(peer_mapper[peer_id].origin == peer_mapper[_peer_id].origin) {
    //                         // console.log("*** get same origin***");
    //                         var longitude = peer_mapper[peer_id].longitude - peer_mapper[_peer_id].longitude;
    //                         var latitude = peer_mapper[peer_id].latitude - peer_mapper[_peer_id].latitude;
    //                         peer_mapper[_peer_id].distance = Math.sqrt(Math.pow(longitude, 2) + Math.pow(latitude, 2));
    //                         same_origin.push(peer_mapper[_peer_id]);
    //                     }
    //                     else {
    //                         // console.log("*** get small distance***")
    //                         var longitude = peer_mapper[peer_id].longitude - peer_mapper[_peer_id].longitude;
    //                         var latitude = peer_mapper[peer_id].latitude - peer_mapper[_peer_id].latitude;
    //                         peer_mapper[_peer_id].distance = Math.sqrt(Math.pow(longitude, 2) + Math.pow(latitude, 2));
    //                         small_distance.push(peer_mapper[_peer_id]);
    //                     }
    //                 }
    //             };                   
    //             same_origin.sort(function(peer_1, peer_2 ) {
    //                 if (peer_1.location < peer_2.location)
    //                     return -1;
    //                 if (peer_1.location > peer_2.location)
    //                     return 1;
    //                 return 0;
    //             });
    //             small_distance.sort(function(peer_1, peer_2 ) {
    //                 if (peer_1.location < peer_2.location)
    //                     return -1;
    //                 if (peer_1.location > peer_2.location)
    //                     return 1;
    //                 return 0;
    //             });
    //             length_of_peers = number_friend-peer_id_return.length;
    //             for(var i = 0; i < length_of_peers; i++) {
    //                 if(same_origin[i]) {
    //                     peer_id_return.push(same_origin[i].peer_id);
    //                 }
    //             }
    //             length_of_peers = number_friend-peer_id_return.length;
    //             if(peer_id_return.length < number_friend) {
    //                 for(var i = 0; i < length_of_peers; i++) {
    //                     if(small_distance[i]) {
    //                         peer_id_return.push(small_distance[i].peer_id);
    //                     }
    //                 } 
    //             }
    //             console.log("******////// for "+user_id +"////*************");
    //             for(var i = 0; i < same_origin.length; i++) {
    //                 console.log(same_origin[i].peer_id);
    //             }
    //             console.log(peer_id_return);
    //             return callback(peer_id_return);
    //         }
    //         else {
    //             console.log("*** friend = "+ friends_id.length +" > "+number_friend+" ***");
                // for(var _peer_id in peer_mapper) {
                //     for(var i = 0; i < friends_id.length; i++) {
                //         if(peer_mapper[_peer_id].user_id !== friends_id[i]) {
                //             delete peer_mapper[_peer_id];
                //         }
                //     }
                // };
                // for(var _peer_id in peer_mapper) {
                //     if(peer_mapper[peer_id].user_id !== peer_mapper[_peer_id].user_id) {
                //         if(peer_mapper[peer_id].origin == peer_mapper[_peer_id].origin) {
                //             // console.log("*** get same origin***");
                //             var longitude = peer_mapper[peer_id].longitude - peer_mapper[_peer_id].longitude;
                //             var latitude = peer_mapper[peer_id].latitude - peer_mapper[_peer_id].latitude;
                //             peer_mapper[_peer_id].distance = Math.sqrt(Math.pow(longitude, 2) + Math.pow(latitude, 2));
                //             same_origin.push(peer_mapper[_peer_id]);
                //         }
                //         else {
                //             // console.log("*** get small distance***")
                //             var longitude = peer_mapper[peer_id].longitude - peer_mapper[_peer_id].longitude;
                //             var latitude = peer_mapper[peer_id].latitude - peer_mapper[_peer_id].latitude;
                //             peer_mapper[_peer_id].distance = Math.sqrt(Math.pow(longitude, 2) + Math.pow(latitude, 2));
                //             small_distance.push(peer_mapper[_peer_id]);
                //         }
                //     }
                // };                   
                // same_origin.sort(function(peer_1, peer_2 ) {
                //     if (peer_1.location < peer_2.location)
                //         return -1;
                //     if (peer_1.location > peer_2.location)
                //         return 1;
                //     return 0;
                // });
                // small_distance.sort(function(peer_1, peer_2 ) {
                //     if (peer_1.location < peer_2.location)
                //         return -1;
                //     if (peer_1.location > peer_2.location)
                //         return 1;
                //     return 0;
                // });

                // var length_of_origin =  same_origin.length;
                // if(length_of_origin <= number_friend) {
                //     for(var i = 0; i < length_of_origin; i++) {
                //         peer_id_return.push(same_origin[i].peer_id);
                //         console.log(peer_id_return);
                //     }
                // }
                // else {
                //     for(var i = 0; i < (number_friend-length_of_origin); i++) {
                //         if(small_distance[i]) {
                //             peer_id_return.push(small_distance[i].peer_id);
                //         }
                //     }                   
                // }
                
                // console.log("******////// for "+user_id +"////*************");
                // console.log(peer_id_return);
                // return callback(peer_id_return);     
        //     }        
        // }

        var all = Object.keys(self.peer_mapper);
        var index = all.indexOf(peer_id);
        if (index > -1) {
            all.splice(index, 1);
        }
        return callback(all);
    });
};

RoomManager.prototype.addPeer = function(peer_id, user_id, origin, longitude, latitude, socket){
    console.log("Adding peer:", peer_id);
    var self = this; 
    var peer = PeerContainer.create(peer_id, user_id, origin,  longitude, latitude, socket);
    this.peer_mapper[peer_id] = peer;

    //reg event listener
    peer.on('update-peer', nodeproxy(this.onPeerUpdateRequest, this));

    peer.on('disconnect', nodeproxy(this.onPeerClose, this));

    //init data to sending to peer
    this.bestPeersForPeer(peer_id, function(list_peer_id_return) {
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