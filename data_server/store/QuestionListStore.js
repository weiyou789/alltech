import Store from './MongoStore';
import getQuestionListModel from '../schema/questionList' // 导入questionList表的获取方法

export default class QuestionListStore extends Store {
    constructor() {
        super();
        this.QuestionListModel = getQuestionListModel(this.db); // 获取问题表
    }

    // 保存一个问题
    saveQuestion(data) {
        let question = new this.QuestionListModel(data); // 新增一条问题的记录
        return question.save()
    }

    // 查询所有问题列表，我感觉这个同步查询是不是比较耗时间，可以用promise.all?
    getAllQuestionList(size, start) {
        return this.QuestionListModel
            .find() // 查找条件，全部
            .sort({ _id: -1 }) // 倒序
            .limit(size) // 查询数量
            .skip(start) // 跳过多少条数据
            .lean() // 转换mongoose查询结果类型，从MongooseDocuments转换为JS Object
            .exec() // 执行查询，返回查询结果，这里是具体的JS Object
            .then(doc => {
                return this.QuestionListModel
                    .find()
                    .count() // 查询总数
                    .exec()
                    .then(count => ({ count, list: doc }))
            })
    }

    // 回答问题更新问题的记录
    async solveQuestion(questionId, questionSolve) {
        const question = await this.QuestionListModel.findOne({ "questionId": questionId })
        if (question !== null) {
            let isSolveExists = false
            for (const index in question.questionSolve) {
                if (question.questionSolve[index].solveId === questionSolve.solveId) {
                    question.questionSolve[index] = questionSolve
                    isSolveExists = true
                    break; // 不需要继续循环了
                }
            }
            if (!isSolveExists) {
                // 如果没有找到相同的回复信息，就插入
                question.questionSolve.push(questionSolve)
            }
            return question.save()
        } else {
            // pid 没找到相关 document
        }
    }

    // 分词搜索，暂时不需要
    getQuestionList(keywords) {
        this.QuestionListModel.esSearch({
            query: "测试中国"
        }, function (err, results) {
            console.log(results)
        })
        /*this.QuestionListModel.search({
            query_string: {
                query: "测试中国"
            }
        },function(err,results){
            console.log(results)
        })*/
        /*return this.QuestionListModel
            .find({token})
            .sort({ _id: -1 })
            .limit(size)
            .skip(start)
            .lean()
            .exec()
            .then(doc=>{
                return this.QuestionListModel.find({token}).count().exec().then(count=>({count,list:doc}))
            })*/
    }
}