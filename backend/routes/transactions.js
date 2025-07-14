const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAll, add } = require('../controllers/transactionController');

router.get('/', auth, getAll);
router.post('/', auth, add);

module.exports = router;
