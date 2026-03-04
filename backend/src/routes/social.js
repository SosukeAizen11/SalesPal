const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/social.controller');

const router = Router();

// Social Posts
router.get('/posts', [query('limit').optional().isInt({ min: 1, max: 100 }), query('offset').optional().isInt({ min: 0 })], validate, ctrl.listPosts);
router.get('/posts/:id', [param('id').isUUID()], validate, ctrl.getPost);
router.post('/posts', [body('content').notEmpty().withMessage('Content is required')], validate, ctrl.createPost);
router.put('/posts/:id', [param('id').isUUID()], validate, ctrl.updatePost);
router.delete('/posts/:id', [param('id').isUUID()], validate, ctrl.deletePost);

// Integrations
router.get('/integrations', ctrl.listIntegrations);
router.post('/integrations/connect', [body('platform').notEmpty().withMessage('Platform is required')], validate, ctrl.connectIntegration);
router.post('/integrations/disconnect/:platform', [param('platform').notEmpty()], validate, ctrl.disconnectIntegration);

module.exports = router;
