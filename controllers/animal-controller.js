// controllers/animal-controller.js
const AnimalService = require('../service/animal-service');
const upload = require('../middlewares/file-upload');
const UserModel = require('../models/user-modal');

class AnimalController {
    async createAnimal(req, res, next) {
        try {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return next(err);
                }

                const { name, species, breed, age, gender, description } = req.body;
                const addedBy = req.user.id;

                // Проверяем, был ли загружен файл
                let imageUrl = '';
                if (req.file) {
                    imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
                }

                const animal = await AnimalService.createAnimal(
                    name,
                    species,
                    breed,
                    age,
                    gender,
                    description,
                    imageUrl,
                    addedBy
                );

                return res.json({
                    message: "Добавлено новое животное",
                    animal
                });
            });
        } catch (error) {
            next(error);
        }
    }

    async getAnimals(req, res, next) {
        try {
            const animals = await AnimalService.getAnimals();
            return res.json({
                message: "Животные получены",
                animals
            });
        } catch (error) {
            next(error);
        }
    }

    async getAnimalById(req, res, next) {
        try {
            const { id } = req.params;
            const animal = await AnimalService.getAnimalById(id);
            return res.json(animal);
        } catch (error) {
            next(error);
        }
    }

    async updateAnimal(req, res, next) {
        try {
            const { id } = req.params;
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    return next(err);
                }

                const { name, species, breed, age, gender, description, status } = req.body;

                // Проверяем, был ли загружен файл
                let imageUrl = '';
                if (req.file) {
                    imageUrl = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
                }
                console.log(imageUrl)
                const animal = await AnimalService.updateAnimal(
                    id,
                    name,
                    species,
                    breed,
                    age,
                    gender,
                    description,
                    imageUrl || undefined, // Если файл не загружен, оставляем старую ссылку
                    status
                );

                return res.json(animal);
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAnimal(req, res, next) {
        try {
            const { id } = req.params;
            const result = await AnimalService.deleteAnimal(id);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async moderateAdoption(req, res, next) {
        try {
            const { id } = req.params;
            const { approved } = req.body;
            const animal = await AnimalService.moderateAdoption(id, approved);
            return res.json({
                message: approved ? "Усыновление одобрено" : "Усыновление отклонено",
                animal
            });
        } catch (error) {
            next(error);
        }
    }

    async adoptAnimal(req, res, next) {
        try {
            const { id } = req.params;
            const adoptedBy = req.user.id;
            const animal = await AnimalService.adoptAnimal(id, adoptedBy);
            return res.json({
                message: "Заявка на усыновление отправлена",
                animal
            });
        } catch (error) {
            next(error);
        }
    }

    async getAnimalsByFilters(req, res, next) {
        try {
            const filters = req.query;
            const animals = await AnimalService.getAnimalsByFilters(filters);
            return res.json(animals);
        } catch (error) {
            next(error);
        }
    }

    async getUserAdoptions(req, res, next) {
        try {
            const userId = req.params.userId;
            const adoptions = await AnimalService.getUserAdoptions(userId);
            return res.json(adoptions);
        } catch (error) {
            next(error);
        }

    }

    async getUserAdoptionStats(req, res, next) {
        try {
            const userId = req.params.userId;
            const stats = await AnimalService.getUserAdoptionStats(userId);
            return res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getUniqueSpecies(req, res, next) {
        try {
            const species = await AnimalService.getUniqueSpecies();
            return res.json({
                message: "Получены уникальные виды животных",
                species
            });
        } catch (error) {
            next(error);
        }
    }
    async submitQuestionnaire(req, res, next) {
        try {
            const result = await AnimalService.submitQuestionnaire(req.user.id, req.body);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async moderateQuestionnaire(req, res, next) {
        try {
            console.log(req.body)
            const { approved } = req.body;
            const result = await AnimalService.moderateQuestionnaire(req.params.userId, approved);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async getAdoptionReceipt(req, res, next) {
        try {
            const receipt = await AnimalService.getAdoptionReceipt(req.params.id);
            return res.json(receipt);
        } catch (e) {
            next(e);
        }
    }
    async getAllUsersWithQuestionnaires(req, res, next) {
        try {
            // Получаем всех пользователей с их анкетами
            const users = await UserModel.find(
                {}, // Фильтр (все пользователи)
                'username email role hasCompletedQuestionnaire questionnaire' // Выбираем нужные поля
            );
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AnimalController();