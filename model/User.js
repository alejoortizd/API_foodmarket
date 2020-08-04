const {Schema, model} = require('mongoose');
const bycrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'cliente'
    }
}, {
    timestamps: true
});

// encriptar password
UserSchema.methods.encryptPassword = async password => {
    return await bycrypt.hash(password, 10);
};

// desencriptar password y comparar con el password en bd
UserSchema.methods.matchPassword = async function (password) {
    return await bycrypt.compare(password, this.password);
}

const User = model('User', UserSchema);

module.exports = User;