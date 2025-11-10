import { observer } from "mobx-react-lite";
import { store } from "../stores/store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

const Animals = observer(() => {
  const [animals, setAnimals] = useState([]);
  const [uniqueSpecies, setUniqueSpecies] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    age: "",
    breed: "",
    status: "",
  });

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await store.fetchAnimals();
        setAnimals(response);
        const species = await store.fetchUniqueSpecies();
        setUniqueSpecies(species);
      } catch (error) {
        console.error("Ошибка загрузки животных:", error);
      }
    };
    fetchAnimals();
  }, []);

  const applyFilter = async () => {
    try {
      const response = await store.fetchAnimalsByFilters(filters);
      setAnimals(response);
    } catch (error) {
      console.error("Ошибка при применении фильтра:", error);
    }
  };

  const resetFilters = async () => {
    setFilters({ species: "", age: "", breed: "", status: "" });
    const response = await store.fetchAnimals();
    setAnimals(response);
  };

  if (store.isLoading || !animals) {
    return (
      <div>
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 96px)' }}>
          <Loader size="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 mb-8">
        Наши животные
      </h1>
      <div className="flex gap-8">
        {/* Левая панель с фильтрами */}
        <div className="w-72 bg-white rounded-lg shadow-xl p-6 space-y-4 sticky top-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Фильтры</h2>
          <select
            value={filters.species}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, species: e.target.value }))
            }
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <option value="">Все виды</option>
            {uniqueSpecies.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Максимальный возраст"
            value={filters.age}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, age: e.target.value }))
            }
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          />
          <input
            type="text"
            placeholder="Порода"
            value={filters.breed}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, breed: e.target.value }))
            }
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <option value="">Все статусы</option>
            <option value="Доступен">Доступен</option>
            <option value="Усыновлен">Усыновлен</option>
            <option value="Ожидание">Ожидание</option>
          </select>
          <button
            onClick={applyFilter}
            className="w-full bg-gradient-to-r from-pink-300 to-purple-400 text-white px-4 py-2 rounded-lg hover:from-pink-400 hover:to-purple-500 transition duration-300 shadow-md hover:shadow-lg"
          >
            Применить фильтр
          </button>
          <button
            onClick={resetFilters}
            className="w-full bg-red-300 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
          >
            Сбросить фильтры
          </button>
        </div>
        {/* Правая панель со списком животных */}
        <div className="flex-grow">
          {store.isLoading ? (
            <p>Загрузка...</p>
          ) : animals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <div
                  key={animal._id}
                  className="bg-white rounded-lg shadow-xl p-6 space-y-4"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    {animal.name}
                  </h2>
                  <p className="text-gray-600">{animal.description}</p>
                  {/* Выделение возраста */}
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Возраст:</span>
                    <span className="font-semibold text-pink-300 border-b-2 border-pink-300 pb-1">
                      {animal.age} лет
                    </span>
                  </div>
                  {/* Кнопка "Подробнее" */}
                  <Link
                    to={`/animals/${animal._id}`}
                    className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-400 font-medium rounded-lg hover:bg-pink-200 transition duration-300 shadow-sm"
                  >
                    Подробнее
                    <svg
                      className="w-4 h-4 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Нет животных по заданным критериям.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default Animals;