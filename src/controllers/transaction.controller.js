const Io = require("../utils/io");
const Joi = require("joi");
const usersDB = new Io(`${process.cwd()}/database/users.json`);
const categoryDB = new Io(`${process.cwd()}/database/category.json`);
const historyDB = new Io(`${process.cwd()}/database/history.json`);
const Transaction = require("../models/transaction.model");
const TransactionSchema = Joi.object({
    amount: Joi.number().required(),
    type: Joi.string().valid('kirim', 'chiqim').required(),
    categoryId: Joi.string().required()
});

const createTransaction = async (req, res) => {
    try {
        const { amount, type, categoryId } = req.body;
        const parsedAmount = parseFloat(amount);
        const userId = req.user.payload.id;

        const users = await usersDB.read();
        const categories = await categoryDB.read();
        const histories = await historyDB.read();

        const { error } = TransactionSchema.validate({ amount: parsedAmount, type, categoryId });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        if (isNaN(parsedAmount)) {
            return res.status(400).json({ message: "Amount must be a number" });
        }
        const findUser = users.find(user => user.id === userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const userCategories = categories.filter(category => category.userId === userId);
        const findCategory = userCategories.find(category => category.id === categoryId);
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (type === 'kirim') {
            findUser.balance += parsedAmount;
        } else if (type === 'chiqim') {
            findUser.balance -= parsedAmount;
        }   

        const time = new Date().toLocaleString();
        const newTransaction = new Transaction(userId, parsedAmount, type, categoryId,time);
        histories.push(newTransaction);

        await historyDB.write(histories);
        await usersDB.write(users);
        res.json({ message: "Success", data: newTransaction });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
};


const updateTransaction = async (req, res) => {
    try {
        const {id: balanceId} = req.params;
        const {amount, type, categoryId} = req.body;
        const userId = req.user.payload.id;
        const users = await usersDB.read();
        const categories = await categoryDB.read();
        const histories = await historyDB.read();

        const {error} = TransactionSchema.validate({amount, type, categoryId});
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        const findHistory = histories.find(balance => balance.id === balanceId);
        if (!findHistory) {
            return res.status(404).json({message: `Transaction not found for this ID: ${balanceId}`});
        }
        const findUser = users.find(user => user.id === userId);
        if (!findUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const userCategories = categories.filter(category => category.userId === userId);
        if (!userCategories) {
            return res.status(404).json({message: 'Category not found'});
        }   
        const findCategory = userCategories.find(category => category.id === categoryId);
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        if (type === 'kirim') {
            const parsedAmount = parseFloat(amount);
            if (findHistory.amount < parsedAmount) {
                findUser.balance = findUser.balance + (parsedAmount - findHistory.amount);
                findHistory.amount = parsedAmount;
            } else if (findHistory.amount > parsedAmount) {
                findUser.balance = findUser.balance - (findHistory.amount - parsedAmount);
                findHistory.amount = parsedAmount;
            }
        } else if (type === 'chiqim') {
            const parsedAmount = parseFloat(amount);

            if (findHistory.amount > parsedAmount) {
                findUser.balance = findUser.balance + (findHistory.amount - parsedAmount);
                findHistory.amount = parsedAmount;

            } else if (findHistory.amount < parsedAmount) {
                findUser.balance = findUser.balance - (parsedAmount - findHistory.amount);
                findHistory.amount = parsedAmount;
            }
        }

        await historyDB.write(histories);
        await usersDB.write(users);

        res.json({message: 'Success', data: findHistory});

    } catch (error) {
        console.log(error);
        return res.json({message: 'Internal Server error'});
    }}

const getTransaction = async (req, res) => {
    try {
        const { id: balanceId } = req.params;
        const histories = await historyDB.read();
        const userId = req.user.payload.id;
        const userHistory = histories.find(history => history.id === balanceId && history.userId === userId);
        if (!userHistory) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        res.json({message: 'Success', data: userHistory});
    } catch (error) {
        return res.json({message: 'Internal Server error'});
    }}

const getTransactions = async (req, res) => {
    try {
        const histories = await historyDB.read();
        const userId = req.user.payload.id;
        const userHistories = histories.filter(history => history.userId === userId);
        res.json({message: 'Success', data: userHistories});
    } catch (error) {
        return res.json({message: 'Internal Server error'});
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const {id: historyId } = req.params;
        const histories = await historyDB.read();
        const users = await usersDB.read();
        const userId = req.user.payload.id;
        
        const findUser = users.find(user => user.id === userId);
        if (!findUser) {
            return res.status(404).json({message: 'User not found'});
        }
        const findHistoryIndex = histories.findIndex(history => history.id === historyId && history.userId === userId);
        if (findHistoryIndex === -1) {
            return res.status(404).json({message: 'History not found'});
        }
        const {type, amount} = histories[findHistoryIndex];

        if (type === 'kirim') {
            findUser.balance -= amount;
        } else if (type === 'chiqim') {
            findUser.balance += amount;
        }
        await usersDB.write(users);
        await histories.splice(findHistoryIndex, 1);
        
        await historyDB.write(histories);
        res.json({message: 'Successfylly deleted', data: historyId});
    } catch (error) {
        return res.json({message: 'Internal Server error'});
    }}



module.exports = {
    createTransaction,
    updateTransaction,
    getTransaction,
    getTransactions,
    deleteTransaction,

}