import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "../stores/store";
import BackButton from "./BackButton";
import { observer } from "mobx-react-lite";
import Loader from "./Loader";
import { InformationCircleIcon, UserPlusIcon, CheckCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

const AnimalDetails = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [adoptionStatus, setAdoptionStatus] = useState(null);

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const response = await store.fetchAnimalById(id);
        setAnimal(response);
        setAdoptionStatus(response.adoptionRequest?.status);
      } catch (error) {
        console.error("Ошибка загрузки данных животного:", error);
      }
    };
    fetchAnimalDetails();
  }, [id]);

  const getDisplayValue = (value) => {
    return value !== null && value !== undefined ? value : "Неизвестно";
  };

  const handleAdopt = async () => {
    try {
      const result = await store.adoptAnimal(id);
      setAdoptionStatus(result.animal.adoptionRequest.status);
      const updatedAnimal = await store.fetchAnimalById(id);
      setAnimal(updatedAnimal);
    } catch (error) {
      console.error("Ошибка при усыновлении:", error);
    }
  };

  const handleGoToQuestionnaire = () => {
    navigate("/profile/questionnaire");
  };

  if (store.isLoading || !animal) {
    return (
      <div>
        <div className="flex justify-center items-center" style={{ height: "calc(100vh - 96px)" }}>
          <Loader size="h-8 w-8" />
        </div>
      </div>
    );
  }

  // Проверка текущего пользователя на наличие анкеты
  const currentUser = store.user; // Предполагается, что store.currentUser содержит данные текущего пользователя
  const hasCompletedQuestionnaire = currentUser?.hasCompletedQuestionnaire === true;

  return (
    <div className="container mx-auto p-6" style={{ height: "calc(100vh - 96px)" }}>
      <BackButton />
      <div className="p-6">
        {/* Основной контейнер */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Блок с аватаркой */}
          <div className="flex-shrink-0">
            <img
              src={animal.imageUrl || "http://localhost:5000/Logo.svg"}
              alt={animal.name}
              className="w-64 h-64 rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 flex-grow">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">{animal.name}</h1>
              <p className="text-gray-600">{getDisplayValue(animal.description)}</p>

              {/* Информация о животном */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                  <span>Возраст:</span>
                  <span className="text-pink-600">{getDisplayValue(animal.age)} лет</span>
                </div>
                <div className="flex items-center space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                  <span>Порода:</span>
                  <span className="text-pink-600">{getDisplayValue(animal.breed)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                  <span>Пол:</span>
                  <span className="text-pink-600">{getDisplayValue(animal.gender)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                  <span>Вид:</span>
                  <span className="text-pink-600">{getDisplayValue(animal.species)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>Статус:</span>
                  <span className="text-pink-600">{getDisplayValue(animal.status)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-red-500" />
                  <span>Добавлено:</span>
                  <span className="text-pink-600">
                    {new Date(getDisplayValue(animal.createdAt)).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserPlusIcon className="h-5 w-5 text-blue-500" />
                  <span>Добавил:</span>
                  <span className="text-pink-600">{animal.addedBy?.username || "отсутствует"}</span>
                </div>
                {adoptionStatus === "Ожидание" && (
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span>Статус запроса:</span>
                    <span className="text-pink-600">Ожидание</span>
                  </div>
                )}
                {!adoptionStatus && animal.adoptedBy && (
                  <div className="flex items-center space-x-2">
                    <UserPlusIcon className="h-5 w-5 text-blue-500" />
                    <span>Усыновил:</span>
                    <span className="text-pink-600">{animal.adoptedBy.username}</span>
                  </div>
                )}
              </div>

              {/* Условное отображение кнопки усыновления или сообщения об анкете */}
              <div className="flex flex-col gap-2">
                {!animal.adoptedBy && adoptionStatus !== "Ожидание" && (
                  <div className="flex justify-end">
                    {hasCompletedQuestionnaire ? (
                      <button
                        onClick={handleAdopt}
                        className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
                      >
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        Усыновить
                      </button>
                    ) : (
                      <div className="w-full p-4 bg-yellow-50 rounded-lg shadow-md text-center">
                        <p className="text-yellow-700 mb-4">
                          Чтобы усыновить животное, заполните анкету и дождитесь её подтверждения.
                        </p>
                        <button
                          onClick={handleGoToQuestionnaire}
                          className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
                        >
                          <UserPlusIcon className="h-5 w-5 mr-2" />
                          Перейти к анкете
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AnimalDetails;