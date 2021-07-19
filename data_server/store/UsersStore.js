import Store from "./MongoStore";
import getUsersModel from "../schema/users";

export default class UsersStore extends Store {
    constructor() {
        super();
        this.UsersModel = getUsersModel(this.db);
    }
    saveUser (data) {
        let users = new this.UsersModel(data);
        return users.save()
    }
    loginUser (iphoneNum, password) {
        return this.UsersModel
            .findOne({iphoneNum,password})
            .lean()
            .exec()
    }
    updateToken(iphoneNum,token){
        return this.UsersModel.findOneAndUpdate({ iphoneNum }, {token}, {
            new: true,
            upsert: false
        }).lean()
    }
    findUser(token){
        return this.UsersModel
            .findOne({token})
            .lean()
            .exec()
    }
}