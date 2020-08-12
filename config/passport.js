const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const { ObjectID, ObjectId } = require('mongodb');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true
}, async (email, password, done) => {

    // Confirmar si existe el correo
    const user = await User.findOne({email})
    if (!user) {
        return done(null, false, {message: 'No tienes permisos'})
    } else {
        // confirmar password
        const match = await user.matchPassword(password);
        delete user.password;
        if (match) {
            return done(null, user)
        } else {
            return done(null, false, {message: 'Usuario o Password incorrectos'})
        }
    }

}))

passport.serializeUser((user, done) => {
    done(null, ObjectId(user._id))
});

passport.deserializeUser((_id, done) => {
    User.findById(ObjectId(_id), (err, user) => {
        done(err, user);
    })
});