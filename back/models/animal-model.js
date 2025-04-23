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
    adoptionDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    adoptionRequest: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Ожидание', 'Принято', 'Отклонено'] },
        createdAt: { type: Date }
    },
    adoptionReceipt: {
        // Основные данные
        receiptId: { 
          type: String,
          unique: true,
          default: () => `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        },
        issuedAt: { 
          type: Date,
          default: Date.now
        },
        validUntil: {
          type: Date,
          default: function() {
            if (!this.issuedAt) return null;
            const date = new Date(this.issuedAt);
            date.setFullYear(date.getFullYear() + 1); // Действителен 1 год
            return date;
          }
        },
        
        // Участники процесса
        userId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User'
        },
        animalId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Animal'
        },
        moderatorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        
        // Информация об усыновлении
        adoptionDate: {
          type: Date
        },
        adoptionType: {
          type: String,
          enum: ['Полное', 'Временное', 'Передержка'],
          default: 'Полное'
        },
        conditions: {
          sterilizationRequired: Boolean,
          regularCheckups: Boolean,
          cannotTransfer: Boolean,
          otherConditions: [String]
        },
        
        // Контактные данные
        shelterContact: {
          name: String,
          phone: String,
          email: String
        },
        
        // Юридические аспекты
        contractSigned: {
          type: Boolean,
          default: false
        },
        contractUrl: String,
        
        // Системная информация
        status: {
          type: String,
          enum: ['Активен', 'Расторгнут', 'Истёк'],
          default: 'Активен'
        },
        updates: [{
          date: Date,
          type: String,
          description: String,
          changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        }]
      }
});

const AnimalModel = mongoose.model('Animal', animalSchema);

module.exports = AnimalModel;