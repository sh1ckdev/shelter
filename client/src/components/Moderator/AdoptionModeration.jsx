import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimalService from '../../services/AnimalService';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const AdoptionModeration = () => {
    const [pendingAdoptions, setPendingAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

    useEffect(() => {
        fetchPendingAdoptions();
    }, []);

    const fetchPendingAdoptions = async () => {
        try {
            const response = await AnimalService.getAnimalsByFilters({
                species: "",
                age: "",
                breed: "",
                status: "Ожидание"
            });
            setPendingAdoptions(response.data);
            console.log(response.data);
        } catch (e) {
            console.error('Ошибка при загрузке заявок на усыновление', e);
        } finally {
            setLoading(false);
        }
    };

    const handleModeration = async (animalId, approved) => {
      try {
        await AnimalService.moderateAdoption(animalId, approved);
        console.log(approved ? 'Усыновление одобрено' : 'Усыновление отклонено');
        fetchPendingAdoptions(); // Обновляем список после модерации
      } catch (e) {
        console.error('Ошибка при обработке заявки', e);
      }
    };
  
    const handleViewQuestionnaire = (questionnaire) => {
      setSelectedQuestionnaire(questionnaire); // Открываем модалку с анкетой
    };
  
    const closeModal = () => {
      setSelectedQuestionnaire(null); // Закрываем модалку
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Модерация усыновлений</h2>
            
            {pendingAdoptions.length == 0 ? (
                <p className="text-gray-600">Нет ожидающих заявок на усыновление</p>
            ) : (
<div className="grid grid-cols-1 gap-6">
      {pendingAdoptions.map((animal) => (
        <motion.div
          key={animal._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" p-6 flex items-start space-x-6"
        >
          {/* Изображение животного */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={animal.imageUrl || "https://via.placeholder.com/128"}
              alt={animal.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* Статус заявки */}
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                animal.adoptionRequest.status === "Принято"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {animal.adoptionRequest.status || "В ожидании"}
            </div>
          </div>
          <div className="flex-grow space-y-2">
            <h3 className="text-xl font-bold text-gray-800">{animal.name}</h3>
            <p className="text-sm text-gray-600">
              {animal.species} - {animal.breed}
            </p>
            <div className="mt-2">
              <p className="font-medium text-gray-700">
                Заявка от:{" "}
                <span className="text-green-500">{animal.adoptedBy.username}</span>
              </p>
              <p className="text-sm text-gray-500">{animal.adoptionRequest.userId.email}</p>
              <p className="text-xs text-gray-400">
                Дата заявки:{" "}
                {new Date(animal.adoptionRequest.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleModeration(animal._id, true)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded hover:from-green-600 hover:to-green-700 transition duration-300"
            >
              Одобрить
            </button>
            <button
              onClick={() => handleModeration(animal._id, false)}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded hover:from-red-600 hover:to-red-700 transition duration-300"
            >
              Отклонить
            </button>
            <button
                  onClick={() => handleViewQuestionnaire(animal.adoptedBy.questionnaire)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition duration-300"
                >
                  Посмотреть анкету
                </button>
          </div>
        </motion.div>
      ))}
    </div>
            )}
{selectedQuestionnaire && (
        <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-pink-600 mr-2" />
              Анкета пользователя
            </h3>
            <div className="space-y-5 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Есть ли питомцы:</span>{' '}
                  {selectedQuestionnaire.data.hasPets ? 'Да' : 'Нет'}
                  {selectedQuestionnaire.data.hasPets && (
                    <span className="text-gray-600">
                      {' '}
                      ({selectedQuestionnaire.data.petsDetails})
                    </span>
                  )}
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Опыт ухода:</span>{' '}
                  {selectedQuestionnaire.data.experience} (
                  {selectedQuestionnaire.data.experienceYears} лет)
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Жилищные условия:</span>{' '}
                  {selectedQuestionnaire.data.livingConditions}
                  {selectedQuestionnaire.data.hasYard && (
                    <span className="text-gray-600"> (Есть двор)</span>
                  )}
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Доступность:</span>{' '}
                  {selectedQuestionnaire.data.availability} (
                  {selectedQuestionnaire.data.dailyHours} ч/день)
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Члены семьи:</span>{' '}
                  {selectedQuestionnaire.data.familyMembers}
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Есть ли дети:</span>{' '}
                  {selectedQuestionnaire.data.hasChildren ? 'Да' : 'Нет'}
                  {selectedQuestionnaire.data.hasChildren && (
                    <span className="text-gray-600">
                      {' '}
                      (Возраст: {selectedQuestionnaire.data.childrenAges})
                    </span>
                  )}
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-pink-600">Аллергии:</span>{' '}
                  {selectedQuestionnaire.data.allergies ? 'Да' : 'Нет'}
                  {selectedQuestionnaire.data.allergies && (
                    <span className="text-gray-600">
                      {' '}
                      ({selectedQuestionnaire.data.allergyDetails})
                    </span>
                  )}
                </p>
                <p className="bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
                  <span className="font-semibold text-pink-600">Мотивация:</span>{' '}
                  {selectedQuestionnaire.data.motivation}
                </p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm">
                  <span className="font-semibold text-pink-600">Статус:</span>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedQuestionnaire.status === 'Ожидание'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedQuestionnaire.status === 'Принято'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedQuestionnaire.status}
                  </span>
                </p>
                <p className="text-sm mt-2">
                  <span className="font-semibold text-pink-600">Дата подачи:</span>{' '}
                  {new Date(selectedQuestionnaire.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition duration-300 shadow-md"
            >
              Закрыть
            </button>
          </motion.div>
        </div>
      )}
        </motion.div>
    );
};

export default AdoptionModeration;
