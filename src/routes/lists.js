const express = require('express');
const router = express.Router();
const { createList } = require('../controllers/listController');

router.post('/', createList);

module.exports = router;
