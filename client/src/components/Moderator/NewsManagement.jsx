import { observer } from "mobx-react-lite";
import AdminNewsManager from '../AdminNewsManager';

const NewsManagement = observer(() => {
    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                        Управление новостями
                    </h1>
                    <p className="text-gray-600 mt-2">Создавайте и редактируйте новости и события</p>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="relative z-10">
                    <AdminNewsManager />
                </div>
            </div>
        </div>
    );
});

export default NewsManagement;