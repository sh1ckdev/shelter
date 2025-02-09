import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { store } from "../stores/store";
import BackButton from "./BackButton";
import { observer } from "mobx-react-lite";
import Loader from "./Loader";

const AnimalDetails = observer(() => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const response = await store.fetchAnimalById(id);
        setAnimal(response);
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
      await store.adoptAnimal(id); 
      const updatedAnimal = await store.fetchAnimalById(id);
      setAnimal(updatedAnimal);
    } catch (error) {
      console.error("Ошибка при усыновлении:", error);
    }
  };


  if (store.isLoading || !animal) {
    return (
      <div>
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 96px)' }}>
          <Loader size="h-8 w-8" />
        </div>
      </div>

    );
  }

  return (
    <div className="container mx-auto p-6" style={{ height: 'calc(100vh - 96px)' }}>
      <BackButton />
      <div className="p-6" >
        {/* Основной контейнер с аватаркой и белым блоком */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-medium">Возраст:</p>
                  <p className="text-pink-600">{getDisplayValue(animal.age)} лет</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Порода:</p>
                  <p className="text-pink-600">{getDisplayValue(animal.breed)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Пол:</p>
                  <p className="text-pink-600">{getDisplayValue(animal.gender)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Вид:</p>
                  <p className="text-pink-600">{getDisplayValue(animal.species)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Статус:</p>
                  <p className="text-pink-600">{getDisplayValue(animal.status)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Добавлено:</p>
                  <p className="text-pink-600">
                    {new Date(getDisplayValue(animal.createdAt)).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Добавил:</p>
                  <p className="text-pink-600">
                    {animal.addedBy?.username || "отсутствует"}
                  </p>
                </div>
                {animal.adoptedBy ? (
                  <div>
                    <p className="text-gray-600 font-medium">Усыновил:</p>
                    <p className="text-pink-600">{animal.adoptedBy.username}</p>
                  </div>
                ) : (
                    <div className="flex justify-end">
                  <button
                    onClick={handleAdopt}
                    className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Усыновить
                  </button>
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