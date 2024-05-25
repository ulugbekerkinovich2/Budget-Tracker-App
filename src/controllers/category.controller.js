const { v4: uuid } = require("uuid");
const path = require("path");
const Category = require("../models/category.model");
const Io = require("../utils/io");
const categoryDB = new Io(`${process.cwd()}/database/category.json`);
const usersDB = new Io(`${process.cwd()}/database/users.json`);
const Joi = require('joi');
const { checkToken } = require("../utils/jwt");


const categorySchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    type: Joi.string().valid('kirim', 'chiqim').required(),
    photo: Joi.required()
});
const getCategories = async (req, res) => {
    try {
        const users = await usersDB.read();
        const categories = await categoryDB.read();
        const userId = req.user.payload.id;
        const user = users.find(user => user.id === userId);
        console.log(user);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const userCategories = categories.filter(category => category.userId === userId);
        res.json({ message: "Success", data: userCategories });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        const {photo} = req.files;

        const { error } = categorySchema.validate({ name, type, photo });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const userId = req.user.payload.id;
        const photoName = `${uuid()}${path.extname(photo.name)}`;
        photo.mv(`${process.cwd()}/uploads/${photoName}`);
        const time = new Date().toLocaleString();
        const newCategory = new Category(name, photoName,type, userId,time);
        const categories = await categoryDB.read();
        const findCategory = categories.find(category => category.name === name && category.userId === userId);
        if (findCategory) {
            return res.status(409).json({ message: "Category already exists" });
        }
        categories.push(newCategory);
        await categoryDB.write(categories);
        res.status(201).json({ message: "Todo created successfully", data: newCategory });
    } catch (error) {
        // res.status(500).json({ message: "Internal Server error" });
        res.status(500).json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id: categoryId } = req.params;
        const { name, type } = req.body;
        const userId = req.user.payload.id;
        if (!userId) {
            return res.status(401).json({ message: "Permission denied" });
        }
        try {
            console.log( name, type);
            if ( req.body.photo || name || type || req.files.photo) {
                const categories = await categoryDB.read();
                const categoryIndex = categories.findIndex(category => category.id === categoryId && category.userId === userId);
        
                if (categoryIndex === -1) {
                    return res.status(404).json({ message: "Category not found" });
                }
        
                if (name) {
                    categories[categoryIndex].name = name;
                }
        
                if (type) {
                    categories[categoryIndex].type = type;
                }
                try {
                    const photoName = `${uuid()}${path.extname(req.files.photo.name)}`;
                    req.files.photo.mv(`${process.cwd()}/uploads/${photoName}`);
                    categories[categoryIndex].photo = photoName;
                } catch (error) {
                    time = new Date().toLocaleString();
                    const oldPhoto = categories[categoryIndex].photo;
                    categories[categoryIndex].photo = req.body.photo;
                    categories[categoryIndex].photo = oldPhoto;
                    categories[categoryIndex].time = time;
                }    
                await categoryDB.write(categories);
        
                res.json({ message: "Category updated successfully", data: categories[categoryIndex] });
            }
        } catch (error) {
            return res.status(400).json({ message: "Bad request" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message +'  1' });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id: categoryId } = req.params;
        const categories = await categoryDB.read();
        const userId = req.user.payload.id;
        if (!userId) {
            return res.status(401).json({ message: "Permission denied" });
        }
        const categoryIndex = categories.findIndex(category => category.id === categoryId && category.userId === userId);
        if (categoryIndex === -1) {
            return res.status(404).json({ message: "Category not found" });
        }
        categories.splice(categoryIndex, 1);
        await categoryDB.write(categories);
        return res.json({ message: "Category deleted successfully", data: categoryId });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
        // res.status(500).json({ message: error.message });
    }
}

const getCategory = async (req, res) => {
    try {
        const { id: categoryId } = req.params;
        const userId = req.user.payload.id;
        const categories = await categoryDB.read();
        const findCategory = categories.find(category => category.id === categoryId && category.userId === userId);
        if (!findCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Success", data: findCategory });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" });
    }
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}
