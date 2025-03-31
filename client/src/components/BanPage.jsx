
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { store } from '../stores/store';

const BanPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      store.logout();
      navigate("/login");
    };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col items-center justify-center bg-[#f0edec] text-[#E9C3C7]"
      style={{ height: 'calc(100vh - 100px)' }}
    >
      {/* Заголовок */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-red-500"
      >
        Вы заблокированы
      </motion.h1>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 100 }}
        className="mb-8"
      >
        <FontAwesomeIcon icon={faBan} className="text-9xl text-red-500" />
      </motion.div>

      {/* Описание */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-lg text-center max-w-md mb-8 text-gray-500"
      >
        Ваш аккаунт был временно заблокирован администратором. Для получения дополнительной информации свяжитесь с нами.
      </motion.p>

      {/* Кнопка поддержки */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="px-6 py-3 bg-gradient-to-r from-[#d5c4d4] to-[#d5c4d4] text-white rounded-lg shadow-lg hover:from-[#D8A9AD] hover:to-[#E9C3C7] transition duration-300"
      >
        Выйти
      </motion.button>
    </motion.div>
  );
};

export default BanPage;