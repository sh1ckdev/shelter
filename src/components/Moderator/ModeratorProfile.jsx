import { observer } from "mobx-react-lite";
import { store } from "../../stores/store";
import { PencilSquareIcon, UserIcon, AtSymbolIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import EditProfileModal from "../EditProfileModal";

const ModeratorProfile = observer(() => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async (fieldsToUpdate) => {
        await store.updateProfile(store.user.id, fieldsToUpdate);
    };

    useEffect(() => {
       
    }, []);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-b">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Профиль модератора
                    </h1>
                    <p className="text-gray-600 mt-2">Управляйте вашими данными и активностью</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-lg"
                >
                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                    Редактировать профиль
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Personal Information */}
                <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-pink-200 rounded-lg blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                            <UserIcon className="h-6 w-6 mr-2 text-pink-500" />
                            Личная информация
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <AtSymbolIcon className="h-5 w-5 mr-2 text-pink-500" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Email:</span>{" "}
                                    <span className="font-semibold">{store.user.email}</span>
                                </p>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-pink-500" />
                                <p className="text-gray-700">
                                    <span className="font-medium">Имя пользователя:</span>{" "}
                                    <span className="font-semibold">{store.user.username}</span>
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

export default ModeratorProfile;