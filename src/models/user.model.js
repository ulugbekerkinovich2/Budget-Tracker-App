const { v4: uuid } = require("uuid");

class User {
  constructor(fullname, password, photo, phone,balance,time) {
    this.id = uuid();
    this.fullname = fullname;
    this.password = password;
    this.photo = photo;
    this.phone = phone;
    this.balance = balance;
    this.is_admin = false;
    this.time = time
  }
}

module.exports = User;
