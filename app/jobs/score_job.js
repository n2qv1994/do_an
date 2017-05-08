var user_service = require("../services/user_service.js");
var friend_service = require("../services/friend_service.js");
var kue = require('kue');

// module.exports.increase_score = function(data, list_user) {
//   global.queue.process('increase_score', function (job, done){
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> increase_score");
//    /* carry out all the job function here */
//     for(var socket_id in list_user) {
// 	    if(list_user[socket_id].socket_id == data.sender_id) {
// 	        var sender_id = list_user[socket_id].user_id;
// 	        user_service.update_score(list_user[socket_id].username);
// 	        for(var socket_id in list_user) {
// 	          if(list_user[socket_id].username == data.receiver) {
// 	            friend_service.update_score(list_user[socket_id].user_id, sender_id);
// 	            return;
// 	          }
// 	        }   
// 	        return;
// 	      }
// 	    } 
//    return done && done();
//   });

//   var job = global.queue.create('increase_score', {
//   });

//   job
//   .on('complete', function (){
//       console.log('Job', job.id, 'increase_score is done');
//       kue.Job.get(job.id, function(err, job){
//       if (err) return;
//       job.remove(function(err){
//         if (err) throw err;
//         console.log('removed completed job #%d', job.id);
//       });
//     });
//   })
//   .on('failed', function (){
//       console.log('Job', job.id, 'increase_score has  failed');
//   });
//   job.save();
// };

module.exports.update_user_score = function(username) {
  global.queue.process('update_user_score', function (job, done){
   /* carry out all the job function here */
      user_service.update_score(job.data.username);
      return done && done();
  });

  var job = global.queue.create('update_user_score', {
    username: username
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'update_user_score is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'update_user_score has  failed');
  });
  job.save();
};

module.exports.update_friend_score = function(user_id, sender_id) {
  global.queue.process('update_friend_score', function (job, done){
    friend_service.update_score(job.data.user_id, job.data.sender_id);
    return done && done();
  });

  var job = global.queue.create('update_friend_score', {
    user_id: user_id,
    sender_id: sender_id
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'update_friend_score is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'update_friend_score has  failed');
  });
  job.save();
};