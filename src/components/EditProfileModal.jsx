import { useState, useEffect } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { store } from "../stores/store";
import { observer } from "mobx-react-lite";

const EditProfileModal = observer(({ isOpen, onClose, onSave }) => {
    const [username, setUsername] = useState(store.user.username || "");
    const [email, setEmail] = useState(store.user.email || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setUsername(store.user.username || "");
            setEmail(store.user.email || "");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({
                username: '',
                email: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsClosing(false);
        }
    }, [isOpen]);

    const handleSave = async () => {
        // Сброс ошибок
        setErrors({
            username: '',
            email: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });

        // Проверка паролей
        if (newPassword && newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
            return;
        }

        const fieldsToUpdate = {};

        if (username !== store.user.username) {
            fieldsToUpdate.username = username;
        }
        if (email !== store.user.email) {
            fieldsToUpdate.email = email;
        }
        if (newPassword) {
            if (!oldPassword) {
                setErrors(prev => ({ ...prev, oldPassword: 'Введите текущий пароль' }));
                return;
            }
            fieldsToUpdate.oldPassword = oldPassword;
            fieldsToUpdate.newPassword = newPassword;
        }

        try {
            await onSave(fieldsToUpdate);
            handleClose();
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('пароль')) {
                    setErrors(prev => ({ ...prev, oldPassword: 'Неверный текущий пароль' }));
                } else if (errorMessage.includes('никнейм')) {
                    setErrors(prev => ({ ...prev, username: 'Этот никнейм уже занят' }));
                } else if (errorMessage.includes('email')) {
                    setErrors(prev => ({ ...prev, email: 'Этот email уже занят' }));
                }
            } else {
                setErrors(prev => ({ ...prev, general: 'Ошибка при обновлении профиля' }));
            }
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
            {/* Модальное окно */}
            <div
                className={`bg-white w-full max-w-md rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isClosing ? "translate-y-full" : "translate-y-0"
                }`}
            >
                {/* Заголовок и кнопка закрытия */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Редактирование профиля</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Основное содержимое */}
                <div className="p-6">
                    {/* Поле для имени пользователя */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.username ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-transparent'
                            }`}
                            placeholder="Введите новое имя"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Поле для email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.email ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-transparent'
                            }`}
                            placeholder="Введите новый email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Поле для старого пароля */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Текущий пароль
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.oldPassword ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-transparent'
                            }`}
                            placeholder="Введите текущий пароль"
                        />
                        {errors.oldPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                        )}
                    </div>

                    {/* Поле для нового пароля */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Новый пароль
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.newPassword ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-transparent'
                            }`}
                            placeholder="Введите новый пароль"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Поле для подтверждения нового пароля */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Подтвердите новый пароль
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.confirmPassword ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-transparent'
                            }`}
                            placeholder="Повторите новый пароль"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Сообщение об ошибке */}
                    {errors.general && (
                        <div className="mb-4 text-sm text-red-500 text-center">
                            {errors.general}
                        </div>
                    )}

                    {/* Кнопки действий */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center"
                        >
                            <CheckIcon className="h-5 w-5 mr-2" />
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

// Валидация пропсов
EditProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditProfileModal;