import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NewsService from '../services/NewsService';
import { CalendarIcon, NewspaperIcon } from "@heroicons/react/24/outline";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const NewsList = ({ isEvent }) => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        loadNews();
    }, [isEvent]);

    const loadNews = async () => {
        try {
            const data = await NewsService.getAllNews(isEvent);
            setNews(data);
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {item.image && (
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-56 object-cover"
                        />
                    )}
                    <div className="p-6">
                        <div className="flex items-center mb-3">
                            {item.isEvent ? (
                                <CalendarIcon className="h-6 w-6 text-purple-500 mr-2" />
                            ) : (
                                <NewspaperIcon className="h-6 w-6 text-blue-500 mr-2" />
                            )}
                            <span className={`text-sm font-semibold ${item.isEvent ? 'text-purple-800 bg-purple-100' : 'text-blue-800 bg-blue-100'} px-3 py-1 rounded-full`}>
                                {item.isEvent ? 'Событие' : 'Новость'}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                            {item.isEvent && item.eventDate && (
                                <p className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                                    <span className="font-medium">Дата события: </span> {formatDate(item.eventDate)}
                                </p>
                            )}
                            <p className="flex items-center">
                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">Опубликовано: </span> {formatDate(item.date)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

NewsList.propTypes = {
    isEvent: PropTypes.bool
};

NewsList.defaultProps = {
    isEvent: false
};

export default NewsList;