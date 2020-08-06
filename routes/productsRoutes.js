const { Router } = require('express');
const router = Router();
const routesProducts = require('../lib/productServices');
const isAuth = require('../utils/auth');

// new product
router.get('/products/add', isAuth.isAuthenticated, routesProducts.renderForm)
router.post('/products/new-product', isAuth.isAuthenticated, routesProducts.createNewProduct)

// get all products
router.get('/products', isAuth.isAuthenticated, routesProducts.renderProducts)
// router.post('/api/getProdusts', routesProducts.getproducts);

// edit products
router.get('/products/edit/:productId', isAuth.isAuthenticated, routesProducts.renderEditForm)
router.put('/products/edit/:productId', isAuth.isAuthenticated, routesProducts.updateProduct)

// delete product
router.delete('/products/delete/:productId', isAuth.isAuthenticated, routesProducts.deleteProduct)

module.exports = router;