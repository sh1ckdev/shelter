// controllers/volunteer-controller.js
const VolunteerModel = require('../models/volunteer-model');
const ApiError = require('../exceptions/api-error');

class VolunteerController {
    async getVolunteers(req, res, next) {
        try {
            const volunteers = await VolunteerModel.find().populate('userId', 'username email');
            return res.json(volunteers);
        } catch (error) {
            next(error);
        }
    }

    async registerVolunteer(req, res, next) {
        try {
            const { userId, tasks, schedule } = req.body;

            // Check if the volunteer already exists
            const existingVolunteer = await VolunteerModel.findOne({ userId });
            if (existingVolunteer) {
                throw ApiError.BadRequest('Этот пользователь уже зарегистрирован как волонтер');
            }

            // Create a new volunteer entry
            const volunteer = new VolunteerModel({
                userId,
                tasks,
                schedule,
            });

            await volunteer.save();

            return res.status(201).json(volunteer);
        } catch (error) {
            next(error);
        }
    }

    async updateVolunteerStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const volunteer = await VolunteerModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!volunteer) {
                throw ApiError.NotFound('Волонтер не найден');
            }

            return res.json(volunteer);
        } catch (error) {
            next(error);
        }
    }

    async deleteVolunteer(req, res, next) {
        try {
            const { id } = req.params;
            const volunteer = await VolunteerModel.findByIdAndDelete(id);

            if (!volunteer) {
                throw ApiError.NotFound('Волонтер не найден');
            }

            return res.json({ message: 'Волонтер успешно удален' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VolunteerController();