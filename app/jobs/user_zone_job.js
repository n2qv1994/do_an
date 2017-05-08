var user_zone_service = require("../services/user_zone_service.js");
var kue = require('kue');

module.exports.add_relation = function(user,room_id) {
  global.queue.process('add_relation', function (job, done){
   /* carry out all the job function here */
      user_zone_service.add_relation(job.data.user, job.data.room_id);
      return done && done();
  });

  var job = global.queue.create('add_relation', {
    user: user,
    room_id: room_id
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'add_relation is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'add_relation has  failed');
  });
  job.save();
};
