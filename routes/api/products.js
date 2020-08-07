const {Router} = require('express');
const router = Router();
const productService = require('../../lib/mongoProducts')

router.get('/', productService.getProducts);
//router.post('/', productService.createProduct)
//router.post('/:productId', productService.getProduct);
//router.put('/:productId', productService.updateProduct)
//router.delete('/:productId', productService.deleteProduct)


module.exports = router;