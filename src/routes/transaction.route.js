const {Router} = require('express');
const router = Router();
const isAuthMiddleware = require('../middlewares/is-auth.middleware');

const {createTransaction,updateTransaction,getTransactions,getTransaction,deleteTransaction} = require('../controllers/transaction.controller')


router.post('/', isAuthMiddleware, createTransaction);
router.patch('/:id', isAuthMiddleware, updateTransaction);
router.get("/",isAuthMiddleware, getTransactions);
router.get('/:id',isAuthMiddleware, getTransaction);
router.delete("/:id",isAuthMiddleware, deleteTransaction);

module.exports = router;