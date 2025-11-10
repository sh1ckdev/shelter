// services/feedback-service.js
const FeedbackModel = require('../models/feedback-model');

class FeedbackService {
    async createFeedback(name, email, message) {
        const feedback = await FeedbackModel.create({ name, email, message });
        return feedback;
    }

    async getFeedback() {
        const feedback = await FeedbackModel.find().sort({ date: -1 });
        return feedback;
    }
}

module.exports = new FeedbackService();