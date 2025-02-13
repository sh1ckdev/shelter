// services/animal-service.js
const AnimalModel = require('../models/animal-model');
const ApiError = require('../exceptions/api-error');

class AnimalService {
    async createAnimal(name, species, breed, age, gender, description, imageUrl, addedBy) {
        const animal = await AnimalModel.create({
            name,
            species,
            breed,
            age,
            gender,
            description,
            imageUrl,
            addedBy
        });

        return animal;
    }

    async getAnimals() {
        const animals = await AnimalModel.find({})
            .populate('addedBy', 'username')
            .populate('adoptedBy', 'username'); 
        return animals;
    }

    async getAnimalById(id) {
        const animal = await AnimalModel.findById(id)
            .populate('addedBy', 'username')
            .populate('adoptedBy', 'username'); 
    
        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }
        return animal;
    }

    async updateAnimal(id, name, species, breed, age, gender, description, imageUrl, status) {
        const animal = await AnimalModel.findByIdAndUpdate(
            id,
            { name, species, breed, age, gender, description, imageUrl, status },
            { new: true }
        );

        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }

        return animal;
    }

    async deleteAnimal(id) {
        const animal = await AnimalModel.findByIdAndDelete(id);
        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }
        return { message: 'Животное успешно удалено' };
    }

    async adoptAnimal(id, adoptedBy) {
        const animal = await AnimalModel.findByIdAndUpdate(
            id,
            { 
                status: 'Ожидание', 
                adoptedBy,
                adoptionRequest: {
                    userId: adoptedBy,
                    status: 'Ожидание',
                    createdAt: new Date()
                }
            },
            { new: true }
        ).populate('adoptedBy', 'username'); 

        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }

        return animal;
    }

    async moderateAdoption(id, approved) {
        const animal = await AnimalModel.findById(id);
        
        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }

        const status = approved ? 'Усыновлен' : 'Доступен';
        
        const updatedAnimal = await AnimalModel.findByIdAndUpdate(
            id,
            { 
                status,
                adoptedBy: approved ? animal.adoptedBy : null,
                adoptionDate: approved ? new Date() : null,
                adoptionRequest: approved ? 
                    { ...animal.adoptionRequest, status: 'Принято' } : 
                    { ...animal.adoptionRequest, status: 'Отклонено' }
            },
            { new: true }
        );

        return updatedAnimal;
    }
    
    async getAnimalsByFilters(filters) {
        const query = {};
        if (filters.species) query.species = filters.species;
        if (filters.age) query.age = { $lte: filters.age };
        if (filters.breed) query.breed = filters.breed;
        if (filters.status) {
            query.status = filters.status;
          }

        const animals = await AnimalModel.find(query)
            .populate('addedBy', 'username')            
            .populate('adoptedBy', 'username'); 
        return animals;
    }

    async getUserAdoptions(userId) {
        const adoptions = await AnimalModel.find({ adoptedBy: userId })
            .populate('addedBy', 'username')
            .populate('adoptedBy', 'username');
        return adoptions;
    }

    async getUserAdoptionStats(userId) {
        const adoptions = await AnimalModel.find({ adoptedBy: userId })
            .sort({ adoptionDate: -1 })
            .populate('addedBy', 'username')
            .populate('adoptedBy', 'username');


        const adoptionsCount = adoptions.length;
        const lastAdoptionDate = adoptions.length > 0 ? adoptions[0].adoptionDate : null;

        return {
            adoptionsCount,
            lastAdoptionDate
        };
    }

    async getUniqueSpecies() {
        try {
            const species = await AnimalModel.distinct('species');
    
            if (!species || species.length === 0) {
                return []; // Возвращаем пустой массив, если нет данных
            }
    
            return species.sort();
        } catch (error) {
            console.error("Ошибка при получении уникальных видов:", error);
            throw error;
        }
    }

}

module.exports = new AnimalService();