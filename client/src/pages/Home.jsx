import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faNewspaper, faComments, faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";

const Home = observer(() => {
  return (
    <motion.div
      className="bg-gradient-to-b from-pink-50 to-white flex flex-col items-center justify-center p-6"
      style={{ height: 'calc(100vh - 96px)' }}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Добро пожаловать в приют &ldquo;Доброе сердце&rdquo;
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Мы заботимся о бездомных животных и помогаем им найти новый дом.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-wrap justify-center gap-12">
        {/* Animals Card */}
        <Link
          to="/animals"
          className="w-80 bg-white rounded-lg shadow-lg p-6 hover:bg-gray-50 transition transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faPaw} style={{ height: '40px', width: '40px' }} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Животные
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Узнайте больше о животных, которые ищут новый дом.
          </p>
        </Link>

        {/* News Card */}
        <Link
          to="/news"
          className="w-80 bg-white rounded-lg shadow-lg p-6 hover:bg-gray-50 transition transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faNewspaper} style={{ height: '40px', width: '40px' }} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Новости
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Читайте последние новости о нашей работе и событиях.
          </p>
        </Link>

        {/* Feedback Card */}
        <Link
          to="/feedback"
          className="w-80 bg-white rounded-lg shadow-lg p-6 hover:bg-gray-50 transition transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faComments} style={{ height: '40px', width: '40px' }} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Отзывы
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Посмотрите отзывы наших благодарных посетителей.
          </p>
        </Link>

        {/* Volunteers Card */}
        <Link
          to="/volunteers"
          className="w-80 bg-white rounded-lg shadow-lg p-6 hover:bg-gray-50 transition transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faHandsHelping} style={{ height: '40px', width: '40px' }} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Волонтеры
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Присоединяйтесь к нашей команде волонтеров и помогайте животным.
          </p>
        </Link>
      </main>

      {/* Call to Action Section */}
      <footer className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Хочешь помочь?
        </h2>
        <p className="text-gray-700 mt-4">
          Стань частью нашего сообщества и помоги спасти жизнь. Каждый вклад важен!
        </p>
        <button className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg">
          Присоединиться сейчас
        </button>
      </footer>
    </motion.div>
  );
});

export default Home;