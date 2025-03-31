import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { store } from "../../stores/store";

const UserQuestionnaires = observer(() => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [loadingStates, setLoadingStates] = useState({}); // Локальное состояние загрузки для каждого пользователя

  useEffect(() => {
    store.fetchUsers(); // Загружаем пользователей при монтировании
  }, []);

  const handleApprove = async (userId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true })); // Устанавливаем состояние загрузки
      await store.moderateQuestionnaire(userId, true); // Ждем завершения модерации
      await store.fetchUsers(); // После успешной модерации обновляем список пользователей
    } catch (error) {
      console.error("Ошибка при одобрении анкеты:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false })); // Сбрасываем состояние загрузки
    }
  };

  const handleReject = async (userId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true })); // Устанавливаем состояние загрузки
      await store.moderateQuestionnaire(userId, false); // Ждем завершения модерации
      await store.fetchUsers(); // После успешной модерации обновляем список пользователей
    } catch (error) {
      console.error("Ошибка при отклонении анкеты:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false })); // Сбрасываем состояние загрузки
    }
  };

  // Фильтруем пользователей, у которых есть анкета
  const usersWithQuestionnaires = store.users.filter(
    (user) => user.questionnaire && Object.keys(user.questionnaire).length > 0
  );

  const QuestionnaireModal = ({ questionnaire, onClose }) => {
    const fieldLabels = {
      hasPets: "Наличие других животных",
      petsDetails: "Детали о животных",
      experience: "Опыт ухода за животными",
      experienceYears: "Стаж опыта (лет)",
      livingConditions: "Жилищные условия",
      hasYard: "Наличие двора",
      availability: "Наличие свободного времени",
      dailyHours: "Часы в день для животного",
      familyMembers: "Количество членов семьи",
      hasChildren: "Наличие детей",
      childrenAges: "Возраст детей",
      allergies: "Наличие аллергии",
      allergyDetails: "Детали аллергии",
      motivation: "Мотивация усыновления",
    };

    if (store.isLoading) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="h-10 w-10 border-3 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Данные анкеты</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Дата подачи:</strong>{" "}
              {questionnaire.submittedAt
                ? new Date(questionnaire.submittedAt).toLocaleString()
                : "Не указана"}
            </p>
            <p className="text-sm">
              <strong>Статус:</strong>{" "}
              <span
                className={`font-medium ${
                  questionnaire.status === "Принято"
                    ? "text-green-600"
                    : questionnaire.status === "Отклонено"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {questionnaire.status || "Ожидание"}
              </span>
            </p>
            <div className="border-t border-gray-200 pt-2">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Ответы:</h4>
              {questionnaire.data && Object.keys(questionnaire.data).length > 0 ? (
                <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                  {Object.entries(questionnaire.data).map(([key, value]) => (
                    <li key={key}>
                      <strong>{fieldLabels[key]}:</strong>{" "}
                      {typeof value === "boolean" ? (value ? "Да" : "Нет") : value || "Не указано"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">Данные анкеты отсутствуют</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200 text-sm font-medium"
          >
            Закрыть
          </button>
        </div>
      </motion.div>
    );
  };

  QuestionnaireModal.propTypes = {
    questionnaire: PropTypes.shape({
      submittedAt: PropTypes.string,
      status: PropTypes.oneOf(["Ожидание", "Принято", "Отклонено"]),
      data: PropTypes.object,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Анкеты пользователей</h2>
      {store.isLoading && !Object.keys(loadingStates).length ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : store.message && !usersWithQuestionnaires.length ? (
        <p className="text-red-600">{store.message}</p>
      ) : usersWithQuestionnaires.length === 0 ? (
        <p className="text-gray-600">Пользователей с анкетами пока нет</p>
      ) : (
        <div className="space-y-4">
          {usersWithQuestionnaires.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">
                  Дата подачи:{" "}
                  {user.questionnaire.submittedAt
                    ? new Date(user.questionnaire.submittedAt).toLocaleDateString()
                    : "Не указана"}
                </p>
                <p className="text-sm">
                  Статус:{" "}
                  <span
                    className={`ml-2 font-medium ${
                      user.questionnaire.status === "Принято"
                        ? "text-green-600"
                        : user.questionnaire.status === "Отклонено"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {user.questionnaire.status || "Ожидание"}
                  </span>
                </p>
                <button
                  onClick={() => setSelectedQuestionnaire(user.questionnaire)}
                  className="mt-2 text-sm text-pink-500 hover:text-pink-700 font-medium"
                >
                  Просмотреть анкету
                </button>
              </div>
              {user.questionnaire.status === "Ожидание" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-sm flex items-center"
                    disabled={loadingStates[user._id]}
                  >
                    {loadingStates[user._id] && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm flex items-center"
                    disabled={loadingStates[user._id]}
                  >
                    {loadingStates[user._id] && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    Отклонить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {store.message && (
        <p className={`mt-4 text-sm ${store.message.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
          {store.message}
        </p>
      )}
      {selectedQuestionnaire && (
        <QuestionnaireModal
          questionnaire={selectedQuestionnaire}
          onClose={() => setSelectedQuestionnaire(null)}
        />
      )}
    </motion.div>
  );
});

export default UserQuestionnaires;