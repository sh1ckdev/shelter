import { useState } from 'react';
import NewsList from '../components/NewsList';
import { NewspaperIcon, CalendarIcon } from "@heroicons/react/24/outline";

const NewsPage = () => {
    const [activeTab, setActiveTab] = useState('news');

    return (
        <div className="container mx-auto px-4 py-8 h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    Новости и события
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Будьте в курсе последних новостей и предстоящих событий нашего сообщества
                </p>
            </div>

            <div className="flex justify-center mb-10">
                <div className="inline-flex rounded-xl shadow-md overflow-hidden">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-8 py-3 text-sm font-medium flex items-center transition duration-300 ${activeTab === 'news' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        <NewspaperIcon className="h-5 w-5 mr-2" />
                        Новости
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`px-8 py-3 text-sm font-medium flex items-center transition duration-300 ${activeTab === 'events' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        События
                    </button>
                </div>
            </div>

            {activeTab === 'news' ? (
                <NewsList isEvent={false} />
            ) : (
                <NewsList isEvent={true} />
            )}
        </div>
    );
};

export default NewsPage;