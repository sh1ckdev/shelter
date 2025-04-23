import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faNewspaper, faUser } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";

const Home = observer(() => {
  return (
    <motion.div
      className="bg-gradient-to-b from-pink-50 to-white flex flex-col items-center p-6"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <header className="text-center my-16 max-w-4xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Добро пожаловать в приют &ldquo;Доброе сердце&rdquo;
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Мы заботимся о бездомных животных и помогаем им найти новый дом.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-wrap justify-center gap-12 mb-16 ">
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

        {/* Profile Card */}
        <Link
          to="/profile"
          className="w-80 bg-white rounded-lg shadow-lg p-6 hover:bg-gray-50 transition transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} style={{ height: '40px', width: '40px' }} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Профиль
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Войдите в свой профиль или зарегистрируйтесь.
          </p>
        </Link>
      </main>

      {/* How to Help Section */}
      <section className="w-full max-w-6xl mb-16 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-8">
          Как вы можете помочь
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-pink-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Стать волонтером</h3>
            <p className="text-gray-600">
              Присоединяйтесь к нашей команде волонтеров и помогайте ухаживать за животными.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Материальная помощь</h3>
            <p className="text-gray-600">
              Ваши пожертвования помогают нам обеспечивать животных всем необходимым.
            </p>
          </div>
          <div className="bg-pink-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Взять животное</h3>
            <p className="text-gray-600">
              Подарите дом и любовь одному из наших подопечных.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Распространить информацию</h3>
            <p className="text-gray-600">
              Расскажите о нас своим друзьям и помогите найти дом для животных.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <footer className="mt-8 text-center max-w-4xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
          Хотите помочь?
        </h2>
        <p className="text-gray-700 mt-4">
          Станьте частью нашего сообщества и помогите спасти жизнь. Каждый вклад важен!
        </p>
        <Link to="/profile">
          <button className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg">
            Присоединиться сейчас
          </button>
        </Link>
      </footer>
    </motion.div>
  );
});

export default Home;