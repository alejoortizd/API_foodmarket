const {Router} = require('express');
const router = Router();
const rutasIndex = require('../lib/routesService')

router.get('/', rutasIndex.renderHome)
router.get('/about', rutasIndex.renderAbout)
router.get('/carrito', rutasIndex.renderCarrito)


module.exports = router;