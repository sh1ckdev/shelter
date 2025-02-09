import { Link, Outlet, useLocation } from "react-router-dom";
import { UserIcon, HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const ProfileLayout = () => {
    const location = useLocation();

    return (
        <motion.div
            style={{ height: 'calc(100vh - 96px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Сайдбар */}
                    <div className="col-span-1 bg-white rounded-lg shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Навигация</h2>
                        <nav className="space-y-1">
                            <Link
                                to="/profile"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/profile"
                                    ? "bg-pink-50 text-pink-700"
                                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                    }`}
                            >
                                <UserIcon className="h-5 w-5 mr-2" />
                                Профиль
                            </Link>
                            <Link
                                to="/profile/adoptions"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/profile/adoptions"
                                    ? "bg-pink-50 text-pink-700"
                                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                    }`}
                            >
                                <HeartIcon className="h-5 w-5 mr-2" />
                                Усыновления
                            </Link>
                            <Link
                                to="/animals"
                                className={`flex items-center p-2 rounded-lg transition duration-300 ${location.pathname === "/profile/animals"
                                    ? "bg-pink-50 text-pink-700"
                                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
                                    }`}
                            >
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Животные
                            </Link>
                        </nav>
                    </div>

                    <div
                        className="col-span-1 md:col-span-3"
                    >
                        <Outlet />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileLayout;