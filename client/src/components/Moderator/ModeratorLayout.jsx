import { Link, Outlet, useLocation } from "react-router-dom";
import { UserIcon, ShieldCheckIcon, UsersIcon, SparklesIcon, HeartIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const ModeratorLayout = () => {
    const location = useLocation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen" // Устанавливаем минимальную высоту для всего контейнера
        >
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Сайдбар */}
                    <div className="col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Меню модератора</h2>
                        <nav className="space-y-1">
                            <Link
                                to="/moderator"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator"
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <UserIcon className="h-5 w-5 mr-2" />
                                Профиль
                            </Link>
                            <Link
                                to="/moderator/volunteers"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator/volunteers" // Исправил путь
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <UsersIcon className="h-5 w-5 mr-2" />
                                Управление волонтерами
                            </Link>
                            <Link
                                to="/moderator/manage-animals"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator/manage-animals"
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Управление животными
                            </Link>
                            <Link
                                to="/moderator/adoptions"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator/adoptions"
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                                Модерация усыновлений
                            </Link>
                            <Link
                                to="/moderator/adopted-animals"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator/adopted-animals"
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <HeartIcon className="h-5 w-5 mr-2" />
                                Усыновленные животные
                            </Link>                            <Link
                                to="/moderator/user-questionnaires"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                                    location.pathname === "/moderator/user-questionnaires"
                                        ? "bg-pink-50 text-pink-700"
                                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                            >
                                <HeartIcon className="h-5 w-5 mr-2" />
                                Анкетные заявки
                            </Link>
                        </nav>
                    </div>

                    {/* Основной контент */}
                    <div className="col-span-1 md:col-span-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ModeratorLayout;