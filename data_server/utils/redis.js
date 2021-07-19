import Redis from 'ioredis'

const config = require('../config');

console.info({ msg: 'init redis', event: 'redis', /* options: redisConfig, */ })

let redis = new Redis(config.redisUrl);

redis.on('error', function (error) {
    console.error({ msg: error.message, event: 'redis', stack: error.stack })
})

export default redis