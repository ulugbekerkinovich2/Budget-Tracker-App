const {v4:uuid} = require("uuid");

class Category {
    #id;
    #name;
    #photo;
    #type;
    #userId;
    constructor(name,photo,type,userId,time) {
        this.id = uuid();
        this.name = name;
        this.photo = photo;
        this.type = type;
        this.userId = userId
        this.time = time
    }
}

module.exports = Category;