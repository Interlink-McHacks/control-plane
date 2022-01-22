const argon2 = require('argon2');
const nJwt = require('njwt');

const User = require('../models/User');
const Tenant = require('../models/Tenant');
const TenantACL = require('../models/TenantACL');

const signingKey = process.env.JWT_KEY;

const UserController = {};

UserController.createUser = async function(email, password, name) {
    const hash = await argon2.hash(password);

    await User.create({
        name: name,
        email: email,
        password: hash
    });
}

UserController.login = async function(email, password) {
    const user = await User.findOne({
        email: email
    });

    if(!user){
        throw Error("User with given email does not exist.")
    }

    if(await argon2.verify(user["password"], password)){
        const userACLs = await UserController.getUserACLs(user.id);

        return {
            token: nJwt.create({
                iss: "interlink::control-plane",
                sub: user.id.toString(),
                user: {
                    id: user.id.toString(),
                    name: user["name"],
                    email: email,
                    acls: userACLs
                }
            }, signingKey).compact()
        }
    }
    else {
        throw Error("Invalid password.")
    }
}

UserController.getUser = async function(id) {
    const user = await User.findOne({
        _id: id
    }).select(['-password']);

    if(!user){
        throw Error("User not found!");
    }

    return user;
}

UserController.getUserACLs = async function(id) {
    const acls = await TenantACL.find({
        userID: id
    });

    return acls;
}

module.exports = UserController;