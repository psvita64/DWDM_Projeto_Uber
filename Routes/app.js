const express = require('express');
const { Router } = express;
const router = Router();
const systemController = require('../Controllers/system');
const { authenticate } = require('../middleware');

// App Routes
router.get('/comment/:id', systemController.getCommentByCampanyId);
router.post('/comment/:id', systemController.createComment);

module.exports = router;
