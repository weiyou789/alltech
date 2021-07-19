import { Client } from "elasticsearch";
const config = require('../config');
const client = new Client({ host: '192.168.20.160:9200' })
import questionSchema from '../elsSchema/question'

export default class ElsStore {
    constructor(){
        this.config = questionSchema
        this.client = client
    }
    async createIndex(){
        const { index,includeTypeName } = this.config
        const res = await client.indices.exists({
            index
        })
        if(!res){
            await client.indices.create({//创建索引数据库
                index,
                includeTypeName
            })
            // console.log(this.config)
            await client.indices.putMapping(this.config)//创建索引数据库表类型模型
        }
    }
    async addData(body){
        const { index,type } = this.config
        return this.client.index({//插入数据
            index,
            type,
            body
        })
    }
}