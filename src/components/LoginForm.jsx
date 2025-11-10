import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../stores/store';
import { observer } from "mobx-react-lite";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const LoginForm = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (store.isAuth) {
      navigate('/profile');
    }
    if (store.isModerator) {
      navigate('/moderator');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: '', password: '' }); // Сброс ошибок перед новой попыткой

    try {
      await store.login(username, password);
      if (store.isAuth) {
        if (store.isAdmin) {
          navigate('/admin');
        }
        if (store.isModerator) {
          navigate('/moderator');
        }
        navigate('/profile');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('никнейм')) {
          setErrors(prev => ({ ...prev, username: 'Пользователь с таким никнеймом не найден' }));
        } else if (errorMessage.includes('пароль')) {
          setErrors(prev => ({ ...prev, password: 'Неверный пароль' }));
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white flex items-center justify-center" style={{ height: 'calc(100vh - 96px)' }}>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Вход
        </h2>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="username">
            Имя пользователя
          </label>
          <input
            className={`w-full bg-gray-50 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 ${
              errors.username ? 'ring-2 ring-red-500' : 'focus:ring-pink-500'
            }`}
            id="username"
            type="text"
            placeholder="Введите имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
            Пароль
          </label>
          <input
            className={`w-full bg-gray-50 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 ${
              errors.password ? 'ring-2 ring-red-500' : 'focus:ring-pink-500'
            }`}
            id="password"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          type="submit"
          disabled={store.isLoading}
        >
          {store.isLoading ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              <span className="ml-2">Загрузка...</span>
            </div>
          ) : (
            <>
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Войти
            </>
          )}
        </button>
      </form>
    </div>
  );
});

export default LoginForm;