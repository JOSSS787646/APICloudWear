const mongoose = require('mongoose');
const userAuthSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('UserAuth', userAuthSchema);
