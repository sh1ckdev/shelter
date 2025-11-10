import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Добавляем PropTypes
import { store } from "../stores/store";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdoptedAnimals = observer(() => {
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    useEffect(() => {
        store.fetchUserAdoptions(store.user.id);
    }, []);

    const ReceiptModal = ({ 
        isOpen, 
        onClose, 
        receipt 
    }) => {
        if (!isOpen) return null;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
            >
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                    {/* Шапка чека */}
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-t-lg">
                        <h3 className="text-xl font-bold text-center">Чек об усыновлении</h3>
                        <p className="text-sm text-center mt-1 opacity-90">Приют Доброе сердце</p>
                    </div>

                    {/* Тело чека */}
                    <div className="p-6 border-x border-b border-gray-200">
                        {receipt && (
                            <div className="space-y-4">
                                <div className="border-b border-dashed border-gray-300 pb-4">
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">ID чека:</span> 
                                        <span className="ml-2 text-gray-600">{receipt.receiptId}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">Дата выдачи:</span> 
                                        <span className="ml-2 text-gray-600">{new Date(receipt.issuedAt).toLocaleString()}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">ID пользователя:</span> 
                                        <span className="ml-2 text-gray-600">{receipt.userId}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">ID животного:</span> 
                                        <span className="ml-2 text-gray-600">{receipt.animalId}</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-700">Тип усыновления:</span> 
                                        <span className="ml-2 text-gray-600 font-medium">{receipt.adoptionType}</span>
                                    </p>
                                </div>
                                <div className="border-b border-dashed border-gray-300 pb-4">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Условия:</h4>
                                    <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                                        <li>Стерилизация: <span className="font-medium">{receipt.conditions.sterilizationRequired ? 'Да' : 'Нет'}</span></li>
                                        <li>Регулярные проверки: <span className="font-medium">{receipt.conditions.regularCheckups ? 'Да' : 'Нет'}</span></li>
                                        <li>Запрет передачи: <span className="font-medium">{receipt.conditions.cannotTransfer ? 'Да' : 'Нет'}</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Контакты приюта:</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>{receipt.shelterContact.name}</p>
                                        <p>Тел: <span className="font-medium">{receipt.shelterContact.phone}</span></p>
                                        <p>Email: <span className="font-medium">{receipt.shelterContact.email}</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Нижняя часть с кнопкой */}
                    <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Валидация пропсов для ReceiptModal
    ReceiptModal.propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        receipt: PropTypes.shape({
            receiptId: PropTypes.string.isRequired,
            issuedAt: PropTypes.string.isRequired,
            userId: PropTypes.string.isRequired,
            animalId: PropTypes.string.isRequired,
            adoptionType: PropTypes.string.isRequired,
            conditions: PropTypes.shape({
                sterilizationRequired: PropTypes.bool.isRequired,
                regularCheckups: PropTypes.bool.isRequired,
                cannotTransfer: PropTypes.bool.isRequired,
            }).isRequired,
            shelterContact: PropTypes.shape({
                name: PropTypes.string.isRequired,
                phone: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
            }).isRequired,
        }),
    };

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
                                    <div className="flex space-x-4 mt-4">
                                        <Link
                                            to={`/animals/${animal._id}`}
                                            className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transition duration-300"
                                        >
                                             Подробнее
                                        </Link>
                                        {animal.adoptionReceipt && (
                                            <button
                                                onClick={() => setSelectedReceipt(animal.adoptionReceipt)}
                                                className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-300"
                                            >
                                                Чек
                                            </button>
                                        )}
                                    </div>
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
            <ReceiptModal
                isOpen={!!selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                receipt={selectedReceipt}
            />
        </div>
    );
});

export default AdoptedAnimals;