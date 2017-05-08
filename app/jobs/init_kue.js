var kue = require('kue');
app.use(kue.app);
global.queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: '0.0.0.0',
    db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
});