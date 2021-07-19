import ElsStore from "./ElsStore";

export default class QuestionStore extends ElsStore {
    constructor(config){
        super(config);
    }
    async questionSearch(keywords){
        const { index,type } = this.config
        if(keywords){
            return this.client.search({
                index,
                type,
                analyzer:'ik_smart',
                q:`questionTitle:${keywords}`
            })
        } else {
            return this.client.search({
                index,
                type,
            })
        }
    }
}