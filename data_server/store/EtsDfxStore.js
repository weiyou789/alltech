import MongoStore from "./MongoStore";
import getEtsDfxModel from "../schema/etsDfxList";
import getEtsMinModel from "../schema/etsMinList";
import getEtsGroupModel from "../schema/etsGroupList";

export default class EtsDfxStore extends MongoStore {
                    constructor() {
                        super();
                        this.EtsDfxModel = getEtsDfxModel(this.db);
                        this.EtsMinModel = getEtsMinModel(this.db);
                        this.EtsGroupModel = getEtsGroupModel(this.db);
                    }
                    getEtsDfxMemListMtd(query){
                        const { memberCode } = query
                        return this.EtsDfxModel
                            .find({member_code:memberCode})
                            .sort({ _id: -1 })
                            .lean()
                            .exec()
                            .then(doc => {
                                return this.EtsDfxModel
                                    .find({member_code:memberCode})
                                    .count() // 查询总数
                                    .exec()
                                    .then(count => ({ count, list: doc }))
                            })
                    }
                    getEtsDfxAllListMtd(){
                        return this.EtsDfxModel
                            .find() // 查找条件，全部
                            .sort({ _id: -1 }) // 倒序
                            .limit(10) // 查询数量
                            .lean() // 转换mongoose查询结果类型，从MongooseDocuments转换为JS Object
                            .exec() // 执行查询，返回查询结果，这里是具体的JS Object
                            .then(doc => {
                                return this.EtsDfxModel
                                    .find()
                                    .count() // 查询总数
                                    .exec()
                                    .then(count => ({ count, list: doc }))
                            })
                    }
                    getEtsDfxTimeListMtd(query){
                        const { startTime, endTime } = query
                        return this.EtsDfxModel
                            .find({create_time:{$gte:new Date(startTime),$lt:new Date(endTime)}})
                            .sort({ _id: -1 })
                            .lean() // 转换mongoose查询结果类型，从MongooseDocuments转换为JS Object
                            .exec()
                            .then(doc => {
                                return this.EtsDfxModel
                                    .find({create_time:{$gte:new Date(startTime),$lt:new Date(endTime)}})
                                    .count() // 查询总数
                                    .exec()
                                    .then(count => ({ count, list: doc }))
                            })
                    }
                    /*getEtsDfxTimeLivelyMtd(query){
                     const { startTime, endTime } = query
                     return this.EtsModel
                     .find({create_time:{$gte:new Date(startTime),$lt:new Date(endTime)}})
                     .sort({ _id: -1 })
                     .distinct('member_code')
                     .lean() // 转换mongoose查询结果类型，从MongooseDocuments转换为JS Object
                     .exec()
                     }*/
                    /*getEtsDfxTimeLivelyMtd(query){
                     const { startTime, endTime,source } = query
                     console.log(startTime,endTime)
                     let match = { }
                     if(source){
                     match = { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },source } }
                     } else {
                     match = { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) } } }
                     }
                     return this.EtsModel
                     .aggregate([
                     match,
                     { $project:{ member_code:1,user_name: 1, paltform: 1} },
                     { $group: { _id: '$member_code', content_sum : { $sum: 1 },list: {$push: { user_name:'$user_name',paltform:'$paltform' }} } }
                     ])
                     .exec()
                     }*/
                    getEtsDfxTimeLivelyMtd(query){
                        const { startTime, endTime } = query
                        console.log(startTime,endTime)
                        return this.EtsDfxModel
                            .aggregate([
                                { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) } } },
                                { $group: { _id: '$member_code' } }
                            ])
                            .exec()
                    }
                    getEtsMinTimeLivelyMtd(query){
                        const { startTime, endTime } = query
                        console.log(startTime,endTime)
                        return this.EtsMinModel
                            .aggregate([
                                { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) } } },
                                { $group: { _id: '$member_code' } }
                            ])
                            .exec()
                    }

                    getEtsDfxLookProductNumberMtd(query){
                        const { startTime, endTime } = query
                        return this.EtsDfxModel
                            .aggregate([
                                { $match: {
                                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                                    event: 999,
                                    goodsCode: {
                                        $nin: [null, ""]
                                    }
                                } },
                                { $project:{
                                    create_time: {
                                        $dateToString: {
                                            format: "%Y-%m",
                                            date:{"\$add":["\$create_time",28800000]}
                                        }
                                    },
                                    goodsCode: 1
                                }},
                                {
                                    $group:{
                                        _id: '$create_time',
                                        spuCodes: {
                                            $addToSet: '$goodsCode'
                                        }
                                    }
                                },
                                {
                                    $project:{
                                        _id: 1,
                                        spuCodes:1,
                                        lookNum: {
                                            $size: '$spuCodes'
                                        }
                                    }
                                },
                                {
                                    $sort: {
                                        _id: 1
                                    }
                                }
                            ])
                    }


                    getEtsMinLookProductNumberMtd(query){
                        const { startTime, endTime } = query
                        return this.EtsMinModel
                            .aggregate([//聚合
                                { $match: {//根据create_time,event,goodsCode条件来匹配数据
                                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                                    event: 36,
                                    goodsCode: {
                                        $nin: [null, ""]//排除goodsCode为空的数据
                                    }
                                } },
                                { $project:{//输出create_time和goodsCode字段
                                    create_time: {
                                        $dateToString: {//格式化create_time字段
                                            format: "%Y-%m",
                                            date:{"\$add":["\$create_time",28800000]}//加8小时（不加8小时日期会不准确）
                                        }
                                    },
                                    goodsCode: 1
                                }},
                                {
                                    $group:{//根据create_time字段来聚合数据
                                        _id: '$create_time',
                                        spuCodes: {//把goodsCode聚合去重放到spuCodes数组中
                                            $addToSet: '$goodsCode'
                                        }
                                    }
                                },
                                {
                                    $project:{//输出create_time，spuCodes，lookNum字段
                                        _id: 1,
                                        spuCodes:1,
                                        lookNum: {//lookNum字段是获取spuCodes字段的长度
                                            $size: '$spuCodes'
                                        }
                                    }
                                },
                                {
                                    $sort: {//升序排列
                                        _id: 1
                                    }
                                }
                            ])
                    }

                    getEtsDfxEvenyDayLivelyMtd(query){
                        const { startTime, endTime } = query
                        return this.EtsDfxModel
                            .aggregate([
                                { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) } } },
                                { $project:{
                                    create_time: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date:{"\$add":["\$create_time",28800000]}
                                        }
                                    },
                                    member_code: 1
                                }},
                                {
                                    $group:{
                                        _id: '$create_time',
                                        member_list: {
                                            $addToSet: '$member_code'
                                        }
                                    }
                                },
                                {
                                    $project:{
                                        _id: 1,
                                        members: {
                                            $size: '$member_list'
                                        },
                                        member_list: 1
                                    }
                                },
                                {
                                    $sort: {
                                        _id: 1
                                    }
                                }
                            ])
                    }



                    getEtsMinEvenyDayLivelyMtd(query){
                        const { startTime, endTime } = query
                        return this.EtsMinModel
                            .aggregate([
                                { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) } } },
                                { $project:{
                                    create_time: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date:{"\$add":["\$create_time",28800000]}
                                        }
                                    },
                                    member_code: 1
                                }},
                                {
                                    $group:{
                                        _id: '$create_time',
                                        member_list: {
                                            $addToSet: '$member_code'
                                        }
                                    }
                                },
                                {
                                    $project:{
                                        _id: 1,
                                        members: {
                                            $size: '$member_list'
                                        },
                                        member_list: 1
                                    }
                                },
                                {
                                    $sort: {
                                        _id: 1
                                    }
                                }
                            ])
                    }


                    getEtsDfxPvMtd(query){
                        const { startTime, endTime, pagePath } = query
                        return this.EtsDfxModel
                            .find({create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },pagePath})
                            .count() // 查询总数
                            .exec()
                    }

                    getEtsMinPvMtd(query){
                        const { startTime, endTime, pagePath } = query
                        return this.EtsMinModel
                            .find({create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },pagePath})
                            .count() // 查询总数
                            .exec()
                    }


                    getEtsGroupPvMtd(query){
                        const { startTime, endTime, groupParticipationId,source } = query
                        console.log(startTime, endTime, groupParticipationId,source)
                        return this.EtsGroupModel
                            .find({
                                create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                                group_participation_id:groupParticipationId,
                                source,
                                event:5
                            })
                            .count() // 查询总数
                            .exec()
                    }

                    getEtsGroupUvMtd(query){
                        const { startTime, endTime, groupParticipationId,source } = query
                        return this.EtsGroupModel
                            .aggregate([
                                { $match: {
                                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                                    member_code: {
                                        $nin: [null, ""]//排除member_code为空的数据
                                    },
                                    group_participation_id:groupParticipationId,
                                    source,
                                    event:5
                                } },
                                { $project:{
                                    create_time: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date:{"\$add":["\$create_time",28800000]}
                                        }
                                    },
                                    group_participation_id: 1,
                                    member_code: 1
                                }},
                                {
                                    $group:{
                                        _id: '$member_code',
                                        members : { $sum: 1 },
                                        member_list: {$push:'$member_code'},
                                    }
                                },
                                {
                                    $sort: {
                                        _id: 1
                                    }
                                }
                            ])
                    }

                    getEtsGroupUvListMtd(query){
                        const { startTime, endTime,source } = query
                        return this.EtsGroupModel
                            .aggregate([
                                { $match: {
                                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                                    member_code: {
                                        $nin: [null, ""]//排除member_code为空的数据
                                    },
                                    source,
                                    event:5
                                } },
                                { $project:{
                                    create_time: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date:{"\$add":["\$create_time",28800000]}
                                        }
                                    },
                                    group_participation_id: 1,
                                    login_name:1
                                }},
                                {
                                    $group:{
                                        _id: '$group_participation_id',
                                        member_list: {
                                            $addToSet: '$login_name'
                                        }
                                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ])
    }

    getEtsMinPagePathMtd(query){
        const { startTime, endTime, pagePath } = query
        return this.EtsMinModel
            .aggregate([
                { $match: {
                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                    pagePath,
                    member_code: {
                        $nin: [null, ""]//排除member_code为空的数据
                    }
                } },
                { $project:{
                    create_time: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date:{"\$add":["\$create_time",28800000]}
                        }
                    },
                    pagePath: 1,
                    member_code: 1
                }},
                {
                    $group:{
                        _id: '$member_code',
                        members : { $sum: 1 },
                        member_list: {$push:'$member_code'},
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ])
    }

    getEtsDfxPagePathMtd(query){
        const { startTime, endTime, pagePath } = query
        return this.EtsDfxModel
            .aggregate([
                { $match: {
                    create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },
                    pagePath,
                    member_code: {
                        $nin: [null, ""]//排除member_code为空的数据
                    }
                } },
                { $project:{
                    create_time: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date:{"\$add":["\$create_time",28800000]}
                        }
                    },
                    pagePath: 1,
                    member_code: 1
                }},
                {
                    $group:{
                        _id: '$member_code',
                        members : { $sum: 1 },
                        member_list: {$push:'$member_code'},
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ])
    }

    getEtsAllTimeLivelyMtd(query){//关联查询（慎用，耗性能）
        const { startTime, endTime } = query
        console.log(startTime,endTime)
        return this.EtsDfxModel
            .aggregate([
                { $lookup:
                    {
                        from:'b2b_wxmp_track_event',//关联b2b_wxmp_track_event数据库
                        localField:'member_code',//关联字段
                        foreignField:'member_code',
                        as:'items'//把查询结果汇总到items数组李
                    }
                },
                { $unwind: "$items"},//基于items数组展开数据
                { $match: { create_time: { $gte: new Date(startTime), $lt: new Date(endTime) },items:{create_time: { $gte: new Date(startTime), $lt: new Date(endTime) }} } },
                { $project:{member_code:1,create_time:1,items:{member_code:1,create_time:1}}},
            ])
            .option({ allowDiskUse: true })// 查询文档超过内存限制，容许使用硬盘存储临时文件
            .exec()
    }
}