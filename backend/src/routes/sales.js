const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/sales.controller');

const router = Router();

router.get('/', [query('limit').optional().isInt({ min: 1, max: 100 }), query('offset').optional().isInt({ min: 0 })], validate, ctrl.listDeals);
router.get('/activities', [query('limit').optional().isInt({ min: 1, max: 100 }), query('offset').optional().isInt({ min: 0 })], validate, ctrl.listActivities);
router.get('/:id', [param('id').isUUID()], validate, ctrl.getDeal);
router.post('/', [body('title').notEmpty().withMessage('Title is required')], validate, ctrl.createDeal);
router.put('/:id', [param('id').isUUID()], validate, ctrl.updateDeal);
router.delete('/:id', [param('id').isUUID()], validate, ctrl.deleteDeal);

module.exports = router;
