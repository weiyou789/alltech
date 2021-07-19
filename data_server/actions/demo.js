const error = require('../utils/snError');
const constant = require('../utils/constant');
import { QuestionStore } from '../elsStore'
// import { Client } from "elasticsearch";
// const client = new Client({ host: '192.168.20.160:9200' })



const elsTestCreate = async (ctx, next) => {
    await client.create({
        index: 'myindexb',
        type: 'mytypeB',
        id: '6',
        body: {
            title: '我们的国歌111',
            tags: ['y', 'z'],
            published: true,
            published_at: '2020-09-03',
            counter: 1
        }
    });
}

const elsTestBulk = async (ctx, next) => {
    client.bulk({
        body: [
            // action description
            { index:  { _index: 'myindex', _type: 'mytype', _id: 1 } },
            // the document to index
            { title: 'foo' },
            // action description
            { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
            // the document to update
            { doc: { title: 'foo' } },
            // action description
            { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
            // no document needed for this delete
        ]
    }, function (err, resp) {
        // ...
    });
}

const elsTestGet = async (ctx, next) => {
    const response = await client.get({
        index: 'myindex',
        type: 'mytype',
        id: 1
    });
    ctx.body = Object.assign({ result: response }, constant.SUCCESS);
    return next();
}

const elsTestIndex = async (ctx, next) => {//创建或者更新文档
    const response = await client.index({
        index: 'myindex',
        type: 'mytype',
        id: '1',
        body: {
            title: 'Test 1',
            tags: ['y', 'z'],
            published: true,
        }
    });
    ctx.body = Object.assign({ result: response }, constant.SUCCESS);
    return next();
}

const elsTestMget = async (ctx, next) => {
    /*const response = await client.mget({
        body: {
            docs: [
                { _index: 'myindex', _type: 'mytype', _id: '1' },
                { _index: 'myindexa', _type: 'mytypeA', _id: '1' }
            ]
        }
    });*/
    const response = await client.mget({
        index: 'myindex',
        type: 'mytype',
        body: {
            ids: [1, 2]
        }
    });
    ctx.body = Object.assign({ result: response }, constant.SUCCESS);
    return next();
}

const elsTestMsearch = async (ctx, next) => {
    const response = await client.msearch({
        body: [
            // query_string query, on index/mytype
            { index: 'question', type: 'questionList' },
            { query: { match: { questiontitle: "333" } } }
        ]
    });
    ctx.body = Object.assign({ result: response }, constant.SUCCESS);
    return next();
}

const elsTestSearch = async (ctx, next) => {
    /*const res = await client.indices.analyze({
        body:{
            "analyzer":'ik_smart',
            "text":["中华华为祖国"]
        }
    });
    console.log(res)*/
    const response = await client.search({
        index: 'question',
        type:'questionList',
        // analyzer:'ik_smart',
        q: 'questionTitle:测试'
    });
    ctx.body = Object.assign({ result: response }, constant.SUCCESS);
    return next();
}


const elsTestAnalyze = async (ctx, next) => {//中文分词测试
    /*const response = await client.indices.analyze({
        body:{
            "analyzer":'ik_smart',
            "text":["中华祖国"]
        }
    });
    console.log(response)*/

    /*const response1 = await client.mget({
        index: 'myindex',
        type: 'mytype',
        body: {
            title: '中华祖国'
        }
    });*/
    /*const response2 = await client.search({
        index: 'myindexa',
        analyzer:'ik_smart',
        q: 'title:中华祖国'
    });*/
    /*const response3 = await client.msearch({
        body: [
            // query_string query, on index/mytype
            { index: 'myindexa', type: 'mytypeA' },
            {query:{match:{"title":"中华祖国"}}}
            /!*{
                "query": {
                    "match": {"title":{"query" : "中华","analyzer" : "ik_smart"}}
                }
            }*!/
        ]
    });*/
    /*await client.indices.create({//创建索引数据库
        index: 'mytest-0001',
        includeTypeName:true//必须设置这个才能使用putMapping方法
    });*/
    /*await client.indices.putMapping({//创建索引数据库表类型模型
        index : 'mytest-0001',
        type : 'article',
        includeTypeName: true,//必须设置这个才能使用putMapping方法
        body : {
            article: {
                properties: {
                    title: {
                        type: 'text',//只有text类型才能设置分词器，在els中没有string类型
                        // term_vector: 'with_positions_offsets',
                        analyzer: 'ik_smart',//采用ik_smart做分词器
                        search_analyzer: 'ik_smart',
                        search_quote_analyzer:'ik_smart'
                    },
                    content: {
                        type: 'text',
                    },
                    slug: {
                        type: 'text',
                    },
                    tags: {
                        type: 'text',
                        // index : 'not_analyzed',
                    },
                    update_date: {
                        type : 'date',
                        // index : 'not_analyzed',
                    }
                }
            }
        }
    });*/
    /*await client.index({//插入数据
        index:'mytest-0001',
        type:'article',
        body:{
            title:'测试数据',
            content:'测试的发生的发生的发生'
        }
    })*/
    return next();
}

module.exports = function (app) {
    // app.get("/server/elsTestCreate", elsTestCreate);
    // app.get("/server/elsTestBulk", elsTestBulk);
    // app.get("/server/elsTestGet", elsTestGet);
    // app.get("/server/elsTestIndex", elsTestIndex);
    // app.get("/server/elsTestMget", elsTestMget);
    // app.get("/server/elsTestMsearch", elsTestMsearch);
    // app.get("/server/elsTestSearch", elsTestSearch);
    // app.get("/server/elsTestAnalyze", elsTestAnalyze);
};