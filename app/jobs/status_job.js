var user_service = require("../services/user_service.js");
var friend_service = require("../services/friend_service.js");
var kue = require('kue');

module.exports.update_status = function(user,status) {
  global.queue.process('update_user_status', function (job, done){
   /* carry out all the job function here */
    user_service.update_status(job.data.user, job.data.status);
    friend_service.update_status(job.data.user, job.data.status);
    return done && done();
  });

  var job = global.queue.create('update_user_status', {
    user: user,
    status: status
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'update_user_status is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'update_user_status has  failed');
  });
  job.save();
};
