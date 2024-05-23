// utils/utilMethods.js

const User = require("../models/User");

module.exports =
{
    validatePassword(password) {
        if (!/^[a-zA-Z0-9]{8,12}$/.test(password)) {
            throw new Error('The password must be between 8 and 12 alphanumeric characters.');
        }
    },

    async checkEmailUnique(email) {
        const lowerEmail = email.toLowerCase();
        const user = await User.findOne({ where: { email: lowerEmail } });
        if (user) {
            throw new Error('The email is already in use');
        }
    },

    async checkRole(userId) {
        if (!userId) {
            throw Error('Invalid user id');
        }
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw Error('Failed to fetch user role');
        }

        return user.role;
    }
}