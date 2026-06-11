const express = require('express');
const router = express.Router();
const { getAllSchemes, getSchemeById } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);

module.exports = router;
