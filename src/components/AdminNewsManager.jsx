import { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import NewsService from '../services/NewsService';
import { PencilSquareIcon, TrashIcon, PlusIcon, CalendarIcon, PhotoIcon } from "@heroicons/react/24/outline";

const AdminNewsManager = observer(() => {
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        isEvent: false,
        eventDate: '',
        isPublished: true
    });

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const data = await NewsService.getAllNews();
            setNews(data);
        } catch (error) {
            console.error('Ошибка при загрузке новостей:', error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingNews(null);
        setFormData({
            title: '',
            content: '',
            image: '',
            isEvent: false,
            eventDate: '',
            isPublished: true
        });
    };

    const handleShow = (newsItem = null) => {
        if (newsItem) {
            setEditingNews(newsItem);
            setFormData({
                title: newsItem.title,
                content: newsItem.content,
                image: newsItem.image || '',
                isEvent: newsItem.isEvent || false,
                eventDate: newsItem.eventDate ? newsItem.eventDate : '',
                isPublished: newsItem.isPublished
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNews) {
                await NewsService.updateNews(editingNews._id, formData);
            } else {
                await NewsService.createNews(formData);
            }
            handleClose();
            loadNews();
        } catch (error) {
            console.error('Ошибка при сохранении новости:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
            try {
                await NewsService.deleteNews(id);
                loadNews();
            } catch (error) {
                console.error('Ошибка при удалении новости:', error);
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button
                    onClick={() => handleShow()}
                    className="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Добавить новость
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Заголовок</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Тип</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Дата публикации</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Статус</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {news.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isEvent ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {item.isEvent ? 'Событие' : 'Новость'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.isPublished ? 'Опубликовано' : 'Черновик'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <button
                                        onClick={() => handleShow(item)}
                                        className="text-pink-600 hover:text-pink-800 transition duration-200"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="text-red-600 hover:text-red-800 transition duration-200"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                    {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                                </h3>
                                <button 
                                    onClick={handleClose} 
                                    className="text-gray-400 hover:text-gray-500 transition duration-200"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Содержание</label>
                                    <textarea
                                        rows={4}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <PhotoIcon className="h-5 w-5 mr-2 text-pink-500" />
                                        URL изображения
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={formData.isEvent}
                                        onChange={(e) => setFormData({ ...formData, isEvent: e.target.checked })}
                                        className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isEvent" className="ml-3 block text-sm text-gray-700">
                                        Это событие
                                    </label>
                                </div>

                                {formData.isEvent && (
                                    <div>
                                        <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                                            Дата события
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isPublished" className="ml-3 block text-sm text-gray-700">
                                        Опубликовать
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-200"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-200"
                                    >
                                        {editingNews ? 'Сохранить' : 'Создать'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default AdminNewsManager;