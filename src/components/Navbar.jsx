import { observer } from "mobx-react-lite";
import { Link, useNavigate } from 'react-router-dom';
import { store } from "../stores/store";
import { ArrowRightEndOnRectangleIcon, UserIcon, NewspaperIcon } from '@heroicons/react/24/outline';

const Navbar = observer(() => {
    const navigate = useNavigate();
    const handleLogout = () => {
        store.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-pink-300 to-purple-400 shadow-lg text-white">
            <div className="container mx-auto flex justify-between items-center p-4 relative overflow-hidden">
                <div className="flex items-center space-x-6 z-10">
                    <Link to="/" className="flex items-center">
                        <svg
                            className="w-16 h-16 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                        >
                            <rect width="256" height="256" fill="none" />
                            <circle cx="212" cy="108" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                            <circle cx="44" cy="108" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                            <circle cx="92" cy="60" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                            <circle cx="164" cy="60" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                            <path d="M183.2,155.9a43.6,43.6,0,0,1-20.6-26h0a36,36,0,0,0-69.2,0h0a43.6,43.6,0,0,1-20.6,26A32,32,0,0,0,88,216a32.4,32.4,0,0,0,12.5-2.5,71.8,71.8,0,0,1,55,0A32.4,32.4,0,0,0,168,216a32,32,0,0,0,15.2-60.1Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" />
                        </svg>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-100">
                            Приют {'"Доброе сердце"'}
                        </h1>
                    </Link>
                    <Link
                        to="/news"
                        className="flex items-center text-lg font-medium transition duration-300 hover:text-pink-100"
                    >
                        <NewspaperIcon className="h-6 w-6 mr-2" />
                        Новости и события
                    </Link>
                </div>
                {/* Navigation Links */}
                {store.isAuth ? (
                    <div className="flex items-center space-x-6 z-10">
                        <Link
                            to="/profile"
                            className="flex items-center text-lg font-medium transition duration-300 hover:text-pink-100"
                        >
                            <UserIcon className="h-6 w-6 mr-2" />
                            <p>{store.user.username}</p>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2" />
                            Выйти
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6 z-10">
                        <Link
                            to="/login"
                            className="text-lg font-medium transition duration-300 hover:text-pink-100"
                        >
                            Вход
                        </Link>
                        <Link
                            to="/register"
                            className="text-lg font-medium transition duration-300 hover:text-pink-100"
                        >
                            Регистрация
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
});

export default Navbar;