export default {
    index:'question',
    type : 'questionList',
    includeTypeName: true,//必须设置这个才能使用putMapping方法
    body : {
        questionList: {
            properties: {
                questionTitle: {
                    type: 'text',//只有text类型才能设置分词器，在els中没有string类型
                    analyzer: 'ik_max_word',//采用ik_max_word做分词器
                    search_analyzer: 'ik_max_word',
                    search_quote_analyzer:'ik_max_word'
                },
                questionType:{
                    type: 'text',
                },
                questionDesc: {
                    type: 'text',
                },
                questionSolve: {
                    type: 'text',
                },
                questionTags: {
                    type: 'text',
                    // index : 'not_analyzed',
                },
                update_date: {
                    type:'date'
                }
            }
        }
    }
}