const VolunteerModel = require('../models/volunteer-model');
const UserModel = require('../models/user-modal'); // Импортируем модель пользователя
const ApiError = require('../exceptions/api-error');

class VolunteerService {
    async applyForVolunteer(userId, tasks, schedule) {
        // Проверяем, есть ли уже заявка от этого пользователя
        const existingApplication = await VolunteerModel.findOne({ userId });
        if (existingApplication) {
            throw ApiError.BadRequest('Вы уже подали заявку на волонтера');
        }

        // Создаем новую заявку со статусом "pending"
        const volunteerApplication = new VolunteerModel({
            userId,
            tasks,
            schedule,
            status: 'pending', // Статус по умолчанию
        });

        await volunteerApplication.save();

        return volunteerApplication;
    }

    async approveVolunteer(id) {
        // Находим заявку и обновляем статус на "approved"
        const volunteerApplication = await VolunteerModel.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        );

        if (!volunteerApplication) {
            throw ApiError.NotFound('Заявка на волонтера не найдена');
        }

        // Обновляем роль пользователя на "волонтер"
        const user = await UserModel.findByIdAndUpdate(
            volunteerApplication.userId,
            { role: 'volunteer' }, // Устанавливаем роль "volunteer"
            { new: true }
        );

        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        return volunteerApplication;
    }

    async rejectVolunteer(id) {
        // Находим заявку и обновляем статус на "rejected"
        const volunteerApplication = await VolunteerModel.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true }
        );

        if (!volunteerApplication) {
            throw ApiError.NotFound('Заявка на волонтера не найдена');
        }

        return volunteerApplication;
    }

    async updateVolunteerStatus(id, status) {
        // Обновляем статус волонтера
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
        // Находим волонтера перед удалением
        const volunteer = await VolunteerModel.findById(id);

        if (!volunteer) {
            throw ApiError.NotFound('Волонтер не найден');
        }

        // Меняем роль пользователя обратно на "user"
        await UserModel.findByIdAndUpdate(
            volunteer.userId,
            { role: 'user' }
        );

        // Удаляем волонтера
        await VolunteerModel.findByIdAndDelete(id);

        return volunteer;
    }

    async getVolunteers() {
        // Получаем всех волонтеров
        const volunteers = await VolunteerModel.find().populate('userId', 'username email');
        return volunteers;
    }

    async checkApplicationStatus(userId) {
        const application = await VolunteerModel.findOne({ userId });
        return application ? application.status : 'not_applied';
    }
}

module.exports = new VolunteerService();