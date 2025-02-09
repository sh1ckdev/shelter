import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { store } from "../stores/store";
import { Link } from "react-router-dom";
const AdoptedAnimals = observer(() => {

    useEffect(() => {
         store.fetchUserAdoptions(store.user.id);
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-b ">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-8">
                Усыновленные Животные
            </h1>
            {store.isLoading ? (
                <p className="text-center">Загрузка...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {store.adoptions && store.adoptions.length > 0 ? (
                        store.adoptions.map((animal) => (
                            <div key={animal._id} className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-800">{animal.name}</h2>
                                <p className="text-gray-600">Вид: {animal.species}</p>
                                <p className="text-gray-600">Возраст: {animal.age}</p>
                                <p className="text-gray-600">Описание: {animal.description}</p>
                                <Link to={`/animals/${animal._id}`} className="text-blue-500 hover:text-blue-700 font-medium">Посмотреть</Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full">У вас нет усыновленных животных.</p>
                    )}
                </div>
            )}
        </div>
    );
});

export default AdoptedAnimals;
