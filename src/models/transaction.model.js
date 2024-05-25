const {v4:uuid} = require("uuid");

class Transaction {
    #id;
    #userId;
    #amount;
    #type;
    #categoryId
    constructor(userId, amount,type,categoryId,time) {
        this.id = uuid();
        this.userId = userId;
        this.amount = amount;
        this.type = type;
        this.categoryId = categoryId;
        this.time = time
    }
}
module.exports = Transaction;