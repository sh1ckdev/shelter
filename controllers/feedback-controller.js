const feedbackService = require('../service/feedback-service');
const ApiError = require('../exceptions/api-error');

class FeedbackController {
    // Method to create a feedback entry
    async createFeedback(req, res, next) {
        try {
            const { name, email, message } = req.body;

            // Call the service method to create the feedback
            const feedback = await feedbackService.createFeedback(name, email, message);

            return res.status(201).json(feedback);
        } catch (error) {
            next(error);
        }
    }

    // Method to get all feedback
    async getFeedback(req, res, next) {
        try {
            const feedback = await feedbackService.getFeedback();
            return res.json(feedback);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FeedbackController();
