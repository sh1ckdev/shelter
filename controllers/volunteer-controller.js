const VolunteerService = require('../service/volunteer-service');

class VolunteerController {
    async applyForVolunteer(req, res, next) {
        try {
            const { userId, tasks, schedule } = req.body;
            const volunteerApplication = await VolunteerService.applyForVolunteer(userId, tasks, schedule);
            return res.status(201).json(volunteerApplication);
        } catch (error) {
            next(error);
        }
    }

    async approveVolunteer(req, res, next) {
        try {
            const { id } = req.params;
            const volunteerApplication = await VolunteerService.approveVolunteer(id);
            return res.json(volunteerApplication);
        } catch (error) {
            next(error);
        }
    }

    async rejectVolunteer(req, res, next) {
        try {
            const { id } = req.params;
            const volunteerApplication = await VolunteerService.rejectVolunteer(id);
            return res.json(volunteerApplication);
        } catch (error) {
            next(error);
        }
    }

    async updateVolunteerStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const volunteer = await VolunteerService.updateVolunteerStatus(id, status);
            return res.json(volunteer);
        } catch (error) {
            next(error);
        }
    }

    async deleteVolunteer(req, res, next) {
        try {
            const { id } = req.params;
            const volunteer = await VolunteerService.deleteVolunteer(id);
            return res.json({ message: 'Волонтер успешно удален', volunteer });
        } catch (error) {
            next(error);
        }
    }

    async getVolunteers(req, res, next) {
        try {
            const volunteers = await VolunteerService.getVolunteers();
            return res.json(volunteers);
        } catch (error) {
            next(error);
        }
    }

    async checkApplicationStatus(req, res, next) {
        try {
            const { userId } = req.params;
            const status = await VolunteerService.checkApplicationStatus(userId);
            return res.json(status);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VolunteerController();