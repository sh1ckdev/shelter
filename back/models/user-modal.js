const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }, 
    refreshToken: { type: String },
    hasCompletedQuestionnaire: { type: Boolean, default: false },
    questionnaire: {
        data: { type: Object },
        status: { type: String, enum: ['Ожидание', 'Принято', 'Отклонено'] },
        submittedAt: { type: Date },
        moderatedAt: { type: Date }
    },
    banned: { type: Boolean, default: false },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;