// // var location_helper = require("./helpers/location_helper.js");
// var user_helper = require("../helpers/user_helper.js");

// // var user_service = require("./services/user_service.js");
// var location_service = require("../services/location_service.js");
// // var zone_service = require("./services/zone_service.js");
// var user_zone_service = require("../services/user_zone_service.js");
// var friend_service = require("../services/friend_service.js");
// var kue = require('kue');

// module.exports.update_info = function(info, room_id, socket, list_user) {
//    global.queue.process('add_zone', function (job, done){
//    /* carry out all the job function here */
//    	user_helper.find_by_username(info.username)
//     .then(function(message) {
//         var user = message.data;
//         socket.user = user;
//         socket.username = info.username;
// 	    list_user[socket.id] = {
// 	      username: info.username,
// 	      user_id :user.id,
// 	      socket_id: socket.id
// 	    };
//       	if(room_id != undefined && room_id.length > 0){
//         	getRoom(room_id).addPeer(socket.id, user.id, info.origin, info.longitude, info.latitude, socket);
//      	} 
//       	else {
//           socket.close();
//       	}
// 	    user_helper.update_status(user,"online");
// 	    friend_service.update_status(user,"online");
// 	    location_service.add_location(user, info);
// 	    user_zone_service.add_relation(user, room_id);
//     })
//     .catch(function(message_error) {
//       console.log("*** Find username false ***");
//       console.log(message_error);
//     });
//    	return done && done();
//   });

//   var job = global.queue.create('add_zone', {
//     room_id: room_id
//   });

//   job
//   .on('complete', function (){
//       console.log('Job', job.id, 'add zone', job.data.room_id, ' is done');
//       kue.Job.get(job.id, function(err, job){
//       if (err) return;
//       job.remove(function(err){
//         if (err) throw err;
//         console.log('removed completed job #%d', job.id);
//       });
//     });
//   })
//   .on('failed', function (){
//       console.log('Job', job.id, 'add zone', job.data.room_id, 'has  failed');
//   });
//   job.save();
// }

// function getRoom(room_id){
//     if(!room_mapper.hasOwnProperty(room_id)){
//         room_mapper[room_id] = RoomManager.create(room_id, config);
//     }
//     return room_mapper[room_id];
// }