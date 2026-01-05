const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getMe, updateMe, deleteMe, changePassword } = require('../controllers/userController');

router.use(authenticateToken);

router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changePassword);
router.delete('/me', deleteMe);

module.exports = router;
