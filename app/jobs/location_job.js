var location_service = require("../services/location_service.js");
var kue = require('kue');

module.exports.add_location = function(user,info) {
  global.queue.process('add_location', function (job, done){
   /* carry out all the job function here */
      location_service.add_location(job.data.user, job.data.info);
      return done && done();
  });

  var job = global.queue.create('add_location', {
    user: user,
    info: info
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'add_location is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'add_location has  failed');
  });
  job.save();
};
