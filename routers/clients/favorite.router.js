const express = require('express');
const router = express.Router();
const controller = require("../../controllers/client/favorite.controller");


router.get('/', controller.index);

router.get('/add/:product_id', controller.addToFavorite);

router.get('/remove/:product_id', controller.removeFromFavorite);

module.exports = router