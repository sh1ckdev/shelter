import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { store } from "../stores/store";
import { Link } from "react-router-dom";

const AdoptedAnimals = observer(() => {
    useEffect(() => {
        store.fetchUserAdoptions(store.user.id);
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-b">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-8">
                Усыновленные Животные
            </h1>
            {store.isLoading ? (
                <p className="text-center">Загрузка...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {store.adoptions && store.adoptions.length > 0 ? (
                        store.adoptions.map((animal) => (
                            <div key={animal._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative h-48 w-full bg-gray-200">
                                    {animal.imageUrl ? (
                                        <img
                                            src={animal.imageUrl}
                                            alt={animal.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-500">Нет изображения</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                                        {animal.status}
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <h2 className="text-xl font-bold text-gray-800">{animal.name}</h2>
                                    <p className="text-sm text-gray-600">Вид: {animal.species}</p>
                                    <p className="text-sm text-gray-600">Возраст: {animal.age} лет</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {animal.description}
                                    </p>
                                    <Link
                                        to={`/animals/${animal._id}`}
                                        className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transition duration-300"
                                    >
                                        Посмотреть подробнее
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-600">
                            У вас нет усыновленных животных.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

export default AdoptedAnimals;
