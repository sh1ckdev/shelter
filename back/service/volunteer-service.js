const VolunteerModel = require('../models/volunteer-model');
const ApiError = require('../exceptions/api-error');

class VolunteerService {
    async registerVolunteer(userId, tasks, schedule) {
        // Check if the volunteer already exists
        const existingVolunteer = await VolunteerModel.findOne({ userId });
        if (existingVolunteer) {
            throw ApiError.BadRequest('Этот пользователь уже зарегистрирован как волонтер');
        }

        // Create a new volunteer
        const volunteer = new VolunteerModel({
            userId,
            tasks,
            schedule,
        });

        await volunteer.save();

        return volunteer;
    }

    async updateVolunteerStatus(id, status) {
        const volunteer = await VolunteerModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!volunteer) {
            throw ApiError.NotFound('Волонтер не найден');
        }

        return volunteer;
    }

    async deleteVolunteer(id) {
        const volunteer = await VolunteerModel.findByIdAndDelete(id);

        if (!volunteer) {
            throw ApiError.NotFound('Волонтер не найден');
        }

        return volunteer;
    }

    async getVolunteers() {
        const volunteers = await VolunteerModel.find().populate('userId', 'username email');
        return volunteers;
    }
}

module.exports = new VolunteerService();
