const { Router } = require('express');
const { param } = require('express-validator');
const validate = require('../middleware/validate');
const { requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/users.controller');

const router = Router();

router.get('/me', ctrl.getMe);
router.put('/me', ctrl.updateMe);
router.get('/:id', [param('id').isUUID().withMessage('Valid user ID required')], validate, requireRole('admin', 'user'), ctrl.getUserById);

module.exports = router;
