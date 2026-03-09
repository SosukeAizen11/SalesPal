const { Router } = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/ai.controller');

const router = Router();

router.post('/chat', aiLimiter, [body('message').notEmpty().withMessage('Message is required')], validate, ctrl.chat);
router.get('/campaigns/:campaignId/analyze', aiLimiter, [param('campaignId').isUUID()], validate, ctrl.analyzeCampaign);
router.get('/insights', aiLimiter, ctrl.getStrategicInsights);
router.post('/ad-copy', aiLimiter, [body('productName').notEmpty().withMessage('Product name is required')], validate, ctrl.generateAdCopy);

module.exports = router;
