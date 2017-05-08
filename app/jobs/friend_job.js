var friend_service = require("../services/friend_service.js");
var kue = require('kue');

module.exports.upgrade_to_friend = function(user) {
  global.queue.process('upgrade_to_friend', function (job, done){
   /* carry out all the job function here */
    friend_service.upgrade_to_friend(job.data.user);
    return done && done();
  });

  var job = global.queue.create('upgrade_to_friend', {
    user: user,
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'upgrade_to_friend is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'upgrade_to_friend has  failed');
  });
  job.save();
};
