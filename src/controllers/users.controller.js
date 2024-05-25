const Io = require("../utils/io");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const usersDb = new Io(`${process.cwd()}/database/users.json`); 
const getUsers = async(req, res) => {
    try {
        const users = await usersDb.read();
        res.json({message: "Success", data: users})
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}

const updateUserPassword = async(req, res) => {
    try {
        const {id} = req.params;
        const {password} = req.body;
        const users = await usersDb.read();
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({message: "User not found"});
        }
        const hashedPass = await bcrypt.hash(password, 10);
        users[userIndex].password = hashedPass;
        await usersDb.write(users);
        res.json({message: "Password updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}


// const downloadTransactionsFile = async (req, res) => {
//     try {
//         const folderPath = `${process.cwd()}`+'/database';
//         const filePath = `${folderPath}/history.json`;
//         const fileExists = fs.existsSync(filePath);
//         if (!fileExists) {
//             return res.status(404).json({message: "File not found"});
//         }
//         return res.download(filePath, (err) => {
//         if (err) {
//             return res.status(500).json({message: "Internal Server error"});
//         }
//         return res.json({message: "Success", data: "Downloaded"});
//         });
//     } catch (error) {
//         return res.status(500).json({message: "Internal Server error"});
//     }
// }
module.exports = {
    getUsers,
    updateUserPassword,
    // downloadTransactionsFile
}