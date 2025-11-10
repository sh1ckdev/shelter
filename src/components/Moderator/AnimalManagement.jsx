import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { store } from "../../stores/store";
import AnimalList from "./AnimalList";
import AnimalModal from "./AnimalModal";

const AnimalManagement = observer(() => {
  const [animals, setAnimals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(null); // Текущее животное для редактирования
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка животных при монтировании
  useEffect(() => {
    const fetchAnimals = async () => {
      setIsLoading(true);
      try {
        const data = await store.fetchAnimals();
        setAnimals(data);
      } catch (error) {
        console.error("Ошибка при загрузке животных:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  // Удаление животного
  const handleDelete = async (id) => {
    try {
      await store.deleteAnimal(id);
      setAnimals((prev) => prev.filter((animal) => animal._id !== id));
    } catch (error) {
      console.error("Ошибка при удалении животного:", error);
    }

  };

  // Сохранение животного (создание или обновление)
  const handleSaveAnimal = async (data) => {
    try {
      if (currentAnimal) {
        await store.updateAnimal(currentAnimal._id, data);
      } else {
        await store.createAnimal(data);
      }
      setIsModalOpen(false);
      const updatedAnimals = await store.fetchAnimals();
      setAnimals(updatedAnimals);

    } catch (error) {
      console.error("Ошибка при сохранении животного:", error);
    }
  };

  // Открытие модального окна для редактирования
  const handleEdit = (animal) => {
    setCurrentAnimal(animal);
    setIsModalOpen(true);
  };

  // Открытие модального окна для добавления
  const handleAdd = () => {
    setCurrentAnimal(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Управление животными</h1>

      {/* Кнопка добавления */}
      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Добавить животное
      </button>

      {/* Список животных */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <AnimalList
            animals={animals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Модальное окно */}
      <AnimalModal
        isOpen={isModalOpen}
        initialData={currentAnimal || null} // Передаем данные для редактирования или null для добавления
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnimal} // Колбэк для сохранения данных
      />
    </div>
  );
});

export default AnimalManagement;