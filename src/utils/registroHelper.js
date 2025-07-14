// utils/registroHelper.js
const mongoose = require('mongoose');
const registroSchema = require('../models/RegistroSchema');

function getRegistroModel(userId, fecha) {
  const collectionName = `registros_${userId}_${fecha}`;
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }
  return mongoose.model(collectionName, registroSchema, collectionName);
}

module.exports = { getRegistroModel };
