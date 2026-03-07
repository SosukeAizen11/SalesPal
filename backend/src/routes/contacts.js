const { Router } = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/contacts.controller');

const router = Router();

router.get('/', [query('limit').optional().isInt({ min: 1, max: 100 }), query('offset').optional().isInt({ min: 0 })], validate, ctrl.listContacts);
router.get('/:id', [param('id').isUUID()], validate, ctrl.getContact);
router.post('/', [body('firstName').optional().isString(), body('email').optional().isEmail()], validate, ctrl.createContact);
router.put('/:id', [param('id').isUUID()], validate, ctrl.updateContact);
router.delete('/:id', [param('id').isUUID()], validate, ctrl.deleteContact);

module.exports = router;
