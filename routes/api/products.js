const {Router} = require('express');
const passport = require('passport');
const router = Router();
const productService = require('../../lib/mongoProducts')

router.get('/', productService.getProducts);
// router.get('/successLogin', productService.successLogin);
// router.get('/failedLogin', productService.failedLogin);
// router.get('/api/products/successLogin', (req, res) => {
//   res.status(200).send({success: "ok"});
// });
// router.get('/failedLogin', (req, res) => {
//   res.status(401).send({error: "Unauthorizer"});
// });
router.post('/login', passport.authenticate('local', {
  successRedirect: '/api/successLogin',
  failureRedirect: '/api/failedLogin'
}))
//router.post('/', productService.createProduct)
//router.post('/:productId', productService.getProduct);
//router.put('/:productId', productService.updateProduct)
//router.delete('/:productId', productService.deleteProduct)


module.exports = router;