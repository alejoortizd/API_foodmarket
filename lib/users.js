const User = require('../model/User');
const userCtrl = {};

const passport = require('passport');
const jwt = require('jsonwebtoken');
const {config} = require('../config/index');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('users/singup')
}

userCtrl.singup = async (req, res) => {
    const errors = [];
    const { body: data } = req

    if (data.password != data.confirm_password) {
        errors.push({text: 'Los passwords deben de coincidir'});
    }
    if (data.password.length < 6){
        errors.push({text: 'El password debe de ser mayor a 6 caracteres'})
    }
    if (errors.length > 0) {
        res.render('users/singup', {
            errors,
            name: data.name,
            email: data.email,
        })
    } else {
        const findEmail = await User.findOne({email: data.email})
        if (findEmail) {
            req.flash('error_msg', 'El correo ya esta en uso');
            res.redirect('/users/singup');
        } else {
            const user = new User(req.body);
            user.password = await user.encryptPassword(data.password)
            await user.save();

            const token  = jwt.sign({id: user._id}, config.authJwtSecret, {
                expiresIn: 60 * 60 *24
            })
            req.flash('success_msg', 'Register successfully')
            res.redirect('/users/singin');
        }
    }
}

userCtrl.renderSingInForm = (req, res) => {
    res.render('users/singin')
}

userCtrl.singin = passport.authenticate('local', {
    failureRedirect: '/users/singin',
    successRedirect: '/products',
    failureFlash: true,
});

userCtrl.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Cerraste sesion exitosamente')
    res.redirect('/users/singin');
}


module.exports = userCtrl;