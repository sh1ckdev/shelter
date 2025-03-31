// components/QuestionnaireForm.jsx
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { store } from '../stores/store';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const QuestionnaireForm = observer(() => {
  const [step, setStep] = useState(1); // Текущий шаг
  const totalSteps = 3; // Общее количество шагов

  const [formData, setFormData] = useState({
    hasPets: false,
    petsDetails: '',
    experience: '',
    experienceYears: 0,
    livingConditions: '',
    hasYard: false,
    availability: '',
    dailyHours: 0,
    familyMembers: 0,
    hasChildren: false,
    childrenAges: '',
    allergies: false,
    allergyDetails: '',
    motivation: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await store.submitQuestionnaire(formData);
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, title: 'Личная информация' },
      { num: 2, title: 'Условия проживания' },
      { num: 3, title: 'Дополнительно' },
    ];

    return (
      <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-xs sm:text-base sm:p-4 sm:space-x-4">
        {steps.map((s, index) => (
          <li
            key={s.num}
            className={`flex items-center ${
              s.num <= step ? 'text-pink-600' : ''
            } ${index < steps.length - 1 ? 'flex-1' : ''}`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
                s.num <= step ? 'border-pink-600' : 'border-gray-500'
              }`}
            >
              {s.num}
            </span>
            {s.title}
            {index < steps.length - 1 && (
              <svg
                className="w-3 h-3 ms-2 sm:ms-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Личная информация</h3>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hasPets"
                  checked={formData.hasPets}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">У меня уже есть домашние животные</span>
              </label>
              {formData.hasPets && (
                <textarea
                  name="petsDetails"
                  value={formData.petsDetails}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Опишите ваших питомцев..."
                  rows="2"
                />
              )}
            </div>
            <div>
              <label htmlFor="experience" className="block text-gray-700 mb-1">
                Опыт ухода за животными
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Опишите ваш опыт..."
              />
            </div>
            <div>
              <label htmlFor="experienceYears" className="block text-gray-700 mb-1">
                Сколько лет опыта?
              </label>
              <input
                type="number"
                id="experienceYears"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="0"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Условия проживания</h3>
            <div>
              <label htmlFor="livingConditions" className="block text-gray-700 mb-1">
                Жилищные условия
              </label>
              <textarea
                id="livingConditions"
                name="livingConditions"
                value={formData.livingConditions}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Квартира, дом, наличие двора..."
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hasYard"
                  checked={formData.hasYard}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Есть огороженный двор</span>
              </label>
            </div>
            <div>
              <label htmlFor="availability" className="block text-gray-700 mb-1">
                Доступность для ухода
              </label>
              <textarea
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Сколько времени вы можете уделять животному..."
              />
            </div>
            <div>
              <label htmlFor="dailyHours" className="block text-gray-700 mb-1">
                Сколько часов в день вы можете уделять?
              </label>
              <input
                type="number"
                id="dailyHours"
                name="dailyHours"
                value={formData.dailyHours}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="0"
                max="24"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Дополнительная информация</h3>
            <div>
              <label htmlFor="familyMembers" className="block text-gray-700 mb-1">
                Количество членов семьи
              </label>
              <input
                type="number"
                id="familyMembers"
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hasChildren"
                  checked={formData.hasChildren}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">У меня есть дети</span>
              </label>
              {formData.hasChildren && (
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Укажите возраст детей (например, 5, 7)"
                />
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="allergies"
                  checked={formData.allergies}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">У меня или членов семьи есть аллергии</span>
              </label>
              {formData.allergies && (
                <textarea
                  name="allergyDetails"
                  value={formData.allergyDetails}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Опишите аллергии..."
                  rows="2"
                />
              )}
            </div>
            <div>
              <label htmlFor="motivation" className="block text-gray-700 mb-1">
                Почему вы хотите усыновить животное?
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="Расскажите о вашей мотивации..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPendingMessage = () => (
    <div className="flex items-center justify-center p-6 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
      <div>
        <h3 className="text-lg font-semibold text-green-800">Анкета отправлена</h3>
        <p className="text-green-700">Ваша анкета находится на стадии рассмотрения.</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Анкета для усыновления</h2>

      {store.message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            store.message.includes('Ошибка') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {store.message}
        </div>
      )}

      {store.user?.questionnaire?.status === 'Ожидание' ? (
        renderPendingMessage()
      ) : (
        <>
          {renderStepIndicator()}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Назад
                </button>
              )}
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300"
                >
                  Далее
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={store.loading}
                  className={`ml-auto py-2 px-4 rounded-lg transition duration-300 ${
                    store.loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  {store.loading ? 'Отправка...' : 'Отправить анкету'}
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
});

export default QuestionnaireForm;