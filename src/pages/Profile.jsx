import { observer } from "mobx-react-lite";
import { store } from "../stores/store";
import { PencilSquareIcon, UserIcon, AtSymbolIcon, HeartIcon, } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal";
import { Navigate } from "react-router-dom";

const Profile = observer(() => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const translateRole = (role) => {
        const roleTranslations = {
            'user': 'Пользователь',
            'volunteer': 'Волонтер',
            'moderator': 'Модератор',
            'admin': 'Администратор'
        };
        return roleTranslations[role] || role;
    };

    if (store.isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    if (store.isModerator) {
        return <Navigate to="/moderator" replace />;
    }

    const handleSave = async (fieldsToUpdate) => {
        await store.updateProfile(store.user.id, fieldsToUpdate);
    };

    const handleVolunteerApplication = async () => {
        try {
            const volunteerData = {
                userId: store.user.id,
                email: store.user.email,
                username: store.user.username,
                role: store.user.role,
            };
            await store.applyForVolunteer(volunteerData);
            await store.checkVolunteerApplicationStatus(store.user.id);
        } catch (error) {
            console.error("Ошибка при подаче заявки:", error);

        }
    };

    useEffect(() => {
        store.loadUserAdoptionData(store.user.id);
        store.checkVolunteerApplicationStatus(store.user.id);
    }, []);

    return (
        <div className="container mx-auto p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
                        Профиль пользователя
                    </h1>
                    <p className="text-gray-600 mt-2">Управляйте вашими данными и активностью</p>
                </div>
                <div className="flex flex-row gap-4">
                <button
                        onClick={handleVolunteerApplication}
                        className={`flex items-center bg-gradient-to-r ${
                            store.user.role === 'volunteer' || store.volunteerApplicationPending
                            ? 'from-gray-300 to-gray-400 cursor-not-allowed' 
                            : 'from-purple-300 to-pink-400 hover:from-purple-400 hover:to-pink-500'
                        } text-white px-6 py-3 rounded-lg transition duration-300 shadow-lg`}
                        disabled={store.user.role === 'volunteer' || store.volunteerApplicationPending}
                    >
                        {store.user.role === 'volunteer' 
                            ? 'Вы уже волонтер' 
                            : store.volunteerApplicationPending 
                                ? 'Заявка на рассмотрении'
                                : 'Подать на волонтерство'
                        }
                    </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-gradient-to-r from-pink-300 to-purple-400 text-white px-6 py-3 rounded-lg hover:from-pink-400 hover:to-purple-500 transition duration-300 shadow-lg"
                >
                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                    Редактировать профиль
                </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Personal Information */}
                <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                    {/* Custom Illustration */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-pink-100 rounded-lg blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                            <UserIcon className="h-6 w-6 mr-2 text-pink-300" />
                            Личная информация
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <AtSymbolIcon className="h-5 w-5 mr-2 text-pink-300" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Email:</span>{" "}
                                    <span className="font-semibold">{store.user.email}</span>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-pink-300" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Имя пользователя:</span>{" "}
                                    <span className="font-semibold">{store.user.username}</span>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-pink-300" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Статус:</span>{" "}
                                    <span className="font-semibold">{translateRole(store.user.role)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right Column: Activity Statistics */}
                <div className="col-span-1 bg-white rounded-lg shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                    {/* Custom Illustration */}
                    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-100 rounded-lg blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                            <HeartIcon className="h-6 w-6 mr-2 text-pink-300" />
                            Ваша активность
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
                                <p className="text-sm text-gray-600">Животных усыновлено</p>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
                                    {store.user.adoptionsCount}
                                </p>
                            </div>
                            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
                                <p className="text-sm text-gray-600">Последнее усыновление</p>
                                <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-purple-400 flex items-center bg-clip-text">
                                    {new Date(store.user.lastAdoptionDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal for Editing Profile */}
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
});

export default Profile;