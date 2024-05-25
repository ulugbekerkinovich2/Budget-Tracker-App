const Io = require("../utils/io");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const path = require("path");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const {createToken, checkToken} = require("../utils/jwt");
const { error } = require("console");
const usersDB = new Io(`${process.cwd()}/database/users.json`);

const login = async (req, res) => {
  try {
    const {phone, password } = req.body;

    const check = Joi.object({
      phone: Joi.string().min(5).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = check.validate({ phone, password });
    if (error) return res.status(400).json({ message: error.message });

    const users = await usersDB.read();

    const findUser = users.find((user) => user.phone === phone);
    if (!findUser)
      return res
        .status(403)
        .json({ message: "Incorrect phone or password" });

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) return res.json({ message: "Incorrect phone or password" });

    const token = createToken({ id: findUser.id, is_admin: findUser.is_admin });

    res.json({ message: "You are successfully logged in", data: findUser, token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { fullname, phone, password, balance } = req.body;
    const { photo } = req.files;

    const check = Joi.object({
      fullname: Joi.string().min(5).required(),
      phone: Joi.string().required(),
      password: Joi.string().min(6).required(),
      balance: Joi.number().required(),
      photo: Joi.required()
    });
    const { error } = check.validate({ fullname, phone, password, balance, photo });
    if (error) return res.status(400).json({ message: error.message });

    const users = await usersDB.read();

    const findUser = users.find((user) => user.phone === phone);

    if (findUser)
      return res.status(403).json({ message: "phone already registered" });

    const hashedPass = await bcrypt.hash(password, 10);
    const photoName = `${uuid()}${path.extname(photo.name)}`;

    photo.mv(`${process.cwd()}/uploads/${photoName}`);
    const parsedBalance = parseFloat(balance);
    const dateTime = new Date().toLocaleString();
    const newUser = new User(fullname, hashedPass, photoName,phone, parsedBalance, dateTime);
    users.push(newUser);
    await usersDB.write(users);

    const token = createToken({ id: newUser.id, is_admin: newUser.is_admin });
    res.json({ data: newUser, token: token });
  } catch (error) {;
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  login,
  register,
};
