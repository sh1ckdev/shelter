// services/animal-service.js
const AnimalModel = require('../models/animal-model');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-modal');

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
        const user = await UserModel.findById(adoptedBy);
        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        if (!user.hasCompletedQuestionnaire) {
            throw ApiError.BadRequest('Сначала необходимо пройти анкету');
        }

        const animal = await AnimalModel.findById(id);
        if (!animal) {
            throw ApiError.NotFound('Животное не найдено');
        }

        if (animal.status !== 'Доступен') {
            throw ApiError.BadRequest('Животное недоступно для усыновления');
        }

        const updatedAnimal = await AnimalModel.findByIdAndUpdate(
            id,
            { 
                status: 'Ожидание', 
                adoptedBy: adoptedBy,
                adoptionRequest: {
                    userId: adoptedBy,
                    status: 'Ожидание',
                    createdAt: new Date()
                }
            },
            { new: true }
        ).populate('adoptedBy', 'username');

        return updatedAnimal;
    }

    async moderateAdoption(id, approved, moderatorId) {
        const animal = await AnimalModel.findById(id).populate('adoptedBy');
        
        if (!animal) {
          throw ApiError.NotFound('Животное не найдено');
        }
      
        const user = await UserModel.findById(animal.adoptedBy);
        if (!user || !user.hasCompletedQuestionnaire) {
          throw ApiError.BadRequest('У пользователя нет одобренной анкеты');
        }
      
        const status = approved ? 'Усыновлен' : 'Доступен';
        
        // Подготовка данных для квитанции
        const receiptData = approved ? {
          receiptId: `REC-${Date.now()}-${animal._id}`,
          issuedAt: new Date(),
          userId: animal.adoptedBy._id,
          animalId: animal._id,
          moderatorId: moderatorId,
          adoptionDate: new Date(),
          adoptionType: 'Полное',
          conditions: {
            sterilizationRequired: animal.sterilizationRequired || false,
            regularCheckups: true,
            cannotTransfer: true,
            otherConditions: ['Ежемесячная отправка фотоотчётов']
          },
          shelterContact: {
            name: "Приют 'Доброе сердце'",
            phone: "+7 (123) 456-78-90",
            email: "contact@dobroe-serdtse.ru"
          },
          status: 'Активен'
        } : null;
      
        const updatedAnimal = await AnimalModel.findByIdAndUpdate(
          id,
          { 
            status,
            adoptedBy: approved ? animal.adoptedBy._id : null,
            adoptionDate: approved ? new Date() : null,
            adoptionRequest: {
              ...animal.adoptionRequest,
              status: approved ? 'Принято' : 'Отклонено',
              moderatedAt: new Date(),
              moderator: moderatorId
            },
            adoptionReceipt: receiptData
          },
          { new: true }
        )
        .populate('adoptedBy', 'username email phone')
        .populate('adoptionReceipt.moderatorId', 'username');
      
      
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
            .populate('addedBy', 'username questionnaire')            
            .populate('adoptedBy', 'username questionnaire'); 
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
    async getAdoptionReceipt(animalId) {
        const animal = await AnimalModel.findById(animalId);
        if (!animal || !animal.adoptionReceipt) {
            throw ApiError.NotFound('Квитанция не найдена');
        }
        return animal.adoptionReceipt;
    }
    
    async moderateQuestionnaire(userId, approved) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        if (!user.questionnaire) {
            throw ApiError.BadRequest('Анкета не найдена');
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                questionnaire: {
                    ...user.questionnaire,
                    status: approved ? 'Принято' : 'Отклонено',
                    moderatedAt: new Date()
                },
                hasCompletedQuestionnaire: approved
            },
            { new: true }
        );

        return { 
            message: approved ? 
                'Анкета одобрена, пользователь может усыновлять животных' : 
                'Анкета отклонена'
        };
    }
    async submitQuestionnaire(userId, questionnaireData) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ApiError.NotFound('Пользователь не найден');
        }

        if (user.hasCompletedQuestionnaire) {
            throw ApiError.BadRequest('Анкета уже была пройдена ранее');
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                questionnaire: {
                    data: questionnaireData,
                    status: 'Ожидание',
                    submittedAt: new Date()
                }
            },
            { new: true }
        );

        return { message: 'Анкета успешно отправлена на рассмотрение' };
    }

    async generateAdoptionContract(animal) {
        const contractUrl = await generatePdfContract(animal);
        await AnimalModel.findByIdAndUpdate(
          animal._id,
          { 'adoptionReceipt.contractUrl': contractUrl }
        );
        return contractUrl;
      }
      
      async updateReceiptStatus(receiptId, newStatus) {
        return AnimalModel.findOneAndUpdate(
          { 'adoptionReceipt.receiptId': receiptId },
          { 
            'adoptionReceipt.status': newStatus,
            $push: { 
              'adoptionReceipt.updates': {
                date: new Date(),
                type: 'status_change',
                description: `Статус изменён на ${newStatus}`,
                changedBy: moderatorId
              }
            }
          },
          { new: true }
        );
      }
      
      async getAdoptionReceipt(receiptId) {
        return AnimalModel.findOne(
          { 'adoptionReceipt.receiptId': receiptId },
          { adoptionReceipt: 1 }
        ).populate('userId animalId moderatorId');
      }
}

module.exports = new AnimalService();