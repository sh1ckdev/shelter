// components/AdoptedAnimals.jsx
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { store } from '../../stores/store';

const AdoptedAnimals = observer(() => {
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const data = await store.fetchAnimals();
        setAnimals(data);
      } catch (error) {
        console.error("Ошибка при загрузке животных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  const ReceiptModal = ({ 
    isOpen, 
    onClose, 
    receipt, 
    title = "Чек об усыновлении",
    closeButtonText = "Закрыть",
    className = ""
  }) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className={`bg-white rounded-lg shadow-xl max-w-md w-full ${className}`}>
          {/* Шапка чека */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-t-lg">
            <h3 className="text-xl font-bold text-center">{title}</h3>
            <p className="text-sm text-center mt-1 opacity-90">Приют Доброе сердце</p>
          </div>

          {/* Тело чека */}
          <div className="p-6 border-x border-b border-gray-200">
            {receipt && (
              <div className="space-y-4">
                {/* Основная информация */}
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

                {/* Условия */}
                <div className="border-b border-dashed border-gray-300 pb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Условия:</h4>
                  <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                    <li>Стерилизация: <span className="font-medium">{receipt.conditions.sterilizationRequired ? 'Да' : 'Нет'}</span></li>
                    <li>Регулярные проверки: <span className="font-medium">{receipt.conditions.regularCheckups ? 'Да' : 'Нет'}</span></li>
                    <li>Запрет передачи: <span className="font-medium">{receipt.conditions.cannotTransfer ? 'Да' : 'Нет'}</span></li>
                    <li>Запрет передачи: <span className="font-medium">{receipt.conditions.otherConditions}</span></li>
                  </ul>
                </div>

                {/* Контакты приюта */}
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
              {closeButtonText}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

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
        otherConditions: PropTypes.bool.isRequired,
      }).isRequired,
      shelterContact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
    }),
    title: PropTypes.string,
    closeButtonText: PropTypes.string,
    className: PropTypes.string,
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Усыновленные животные</h2>

      {animals.length === 0 ? (
        <p className="text-gray-600">Нет усыновленных животных</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {animals.map((animal) => (
            <motion.div
              key={animal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 flex items-start space-x-6 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="relative w-32 h-32 flex-shrink-0">
                <img
                  src={animal.imageUrl || 'https://via.placeholder.com/128'}
                  alt={animal.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  Усыновлен
                </div>
              </div>

              <div className="flex-grow space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{animal.name}</h3>
                <p className="text-sm text-gray-600">
                  {animal.species} - {animal.breed}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-pink-600">Усыновитель:</span>{' '}
                  {animal.adoptedBy?.username || 'Неизвестно'}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-pink-600">Дата усыновления:</span>{' '}
                  {animal.adoptionDate
                    ? new Date(animal.adoptionDate).toLocaleDateString()
                    : 'Не указана'}
                </p>
                <button
                  onClick={() => setSelectedReceipt(animal.adoptionReceipt)}
                  className="text-sm text-pink-500 hover:text-pink-700 font-medium"
                >
                  Просмотреть чек
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        title="Чек об усыновлении"
        closeButtonText="Закрыть"
        className="custom-modal-class"
      />
    </motion.div>
  );
});

export default AdoptedAnimals;