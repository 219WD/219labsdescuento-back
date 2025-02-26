const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    googleId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    emailSubscription: { type: mongoose.Schema.Types.ObjectId, ref: "Email" },
});

module.exports = mongoose.model("User", UserSchema);
