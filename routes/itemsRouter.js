const express = require('express');
const itemsController = require('../controllers/itemsController');

const router = express.Router();
router.use(itemsController.getUserInfo);
router.route('/').get(itemsController.getQueryResults);
router.route('/:itemId').get(itemsController.getItemInfo);

module.exports = router;
