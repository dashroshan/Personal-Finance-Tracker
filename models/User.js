const mongoose = require('mongoose');

// User model schema
const UserSchema = mongoose.model('User', new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    data: {
        type: Map,
        required: true
    }
}));

module.exports.model = UserSchema;

// Update the data for the user with the given email address
module.exports.update = async function (email, data) {
    await UserSchema.findOneAndUpdate(
        { email: email },
        { data: data },
        { new: true, upsert: true }
    ).select({ _id: 0 });
}

// Get the data of the user with the given email address
module.exports.getData = async function (email) {
    const User = await UserSchema.findOne({ email: email });
    if (User == null) return { exist: false };
    return { exist: true, ...User._doc }
}