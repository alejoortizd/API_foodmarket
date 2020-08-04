const {Router} = require('express');
const router = Router();
const user = require('../lib/users');

// Hacer render de registro de usuario y registrar usuario
router.get('/users/singup', user.renderSignUpForm);
router.post('/users/singup', user.singup);

// hacer render de login y validar en bd
router.get('/users/singin', user.renderSingInForm);
router.post('/users/singin', user.singin);

// Logout
router.get('/logout', user.logout)


module.exports = router;