const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['Мужской', 'Женский', 'Неизвестно'] },
    description: { type: String },
    imageUrl: { type: String },
    status: { type: String, enum: ['Доступен', 'Усыновлен', 'Ожидание'], default: 'Доступен' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adoptionDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const AnimalModel = mongoose.model('Animal', animalSchema);

module.exports = AnimalModel;