const mongoose = require('mongoose');
const config = require('../config');
const cache = {};
export default class MongoStore {
    // 单例模式，链接数据库
    constructor(){
        if (cache.db) {
            this.db = cache.db;
            return;
        }
        mongoose.set('useCreateIndex', true)
        mongoose.connect(config.mongoUrl, config.opts, (err) => {
            if (err) console.error('mongoose.connect ', err);
        }).then(res => {
            console.log('数据库连接成功')
        });
        this.db = mongoose
        cache.db = this.db
    }
}