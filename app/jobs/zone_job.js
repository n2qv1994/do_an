var zone_service = require("../services/zone_service.js");
var kue = require('kue');

module.exports.add_zone = function(room_id) {
  
  global.queue.process('add_zone', function (job, done){
   /* carry out all the job function here */
   zone_service.add_zone(job.data.room_id);
   return done && done();

  });

  var job = global.queue.create('add_zone', {
    room_id: room_id
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'add zone', job.data.room_id, ' is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'add zone', job.data.room_id, 'has  failed');
  });
  job.save();
};

module.exports.update_http_zone = function(room_name) {

  global.queue.process('update_http_zone', function (job, done){
   /* carry out all the job function here */

   zone_service.update_http_zone(job.data.room_name);
   return done && done();

  });

  var job = global.queue.create('update_http_zone', {
    room_name: room_name,
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'update http zone', job.data.room_name, ' is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'update http zone', job.data.room_name, 'has  failed');
  });
  job.save();
};

module.exports.update_peer_zone = function(room_name) {

  global.queue.process('update_peer_zone', function (job, done){
   /* carry out all the job function here */

   zone_service.update_peer_zone(job.data.room_name);
   return done && done();

  });

  var job = global.queue.create('update_peer_zone', {
    room_name: room_name,
  });

  job
  .on('complete', function (){
      console.log('Job', job.id, 'update peer zone', job.data.room_name, ' is done');
      kue.Job.get(job.id, function(err, job){
      if (err) return;
      job.remove(function(err){
        if (err) throw err;
        console.log('removed completed job #%d', job.id);
      });
    });
  })
  .on('failed', function (){
      console.log('Job', job.id, 'update peer zone', job.data.room_name, 'has  failed');
  });
  job.save();
};