const {Router} = require('express');
const router = Router();
const isAuthMiddleware = require('../middlewares/is-auth.middleware');


const {createCategory,getCategories,updateCategory,deleteCategory,getCategory} = require('../controllers/category.controller');

router.get('/',isAuthMiddleware, getCategories);
router.post('/',isAuthMiddleware, createCategory);
router.patch('/:id',isAuthMiddleware, updateCategory);
router.delete('/:id',isAuthMiddleware, deleteCategory);
router.get('/:id',isAuthMiddleware, getCategory);

module.exports = router;