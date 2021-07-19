
const mysql = require('mysql')
const config = require('../config');
const cache = {};
export default class MySqlStore {
    constructor(db){
        const { mySqlOpts } = config
        this.pool = mysql.createPool({...mySqlOpts,...db})
        this.db = db
    }

    query(sql,callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                console.error(`${this.db.database}数据库连接池建立失败`, err);
            } else {
                console.log(`${this.db.database}数据库连接池建立成功`);
                connection.query(sql,(err,results)=>{
                    callback(err, results) // 结果回调
                    connection.release() // 释放连接资源 | 跟 connection.destroy() 不同，它是销毁
                })
            }

        })
    }
}
