import { useNavigate, useLocation } from "react-router-dom";


const NotFoundPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        if (location.key !== "default") {
            navigate(-1); 
        } else {
            navigate("/"); 
        }
    };
    return (
        <div className="bg-gradient-to-b from-pink-50 to-white flex items-center justify-center" style={{ height: 'calc(100vh - 96px)' }}>


            <div className="relative z-10 text-center space-y-6">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    404
                </h1>
                <p className="text-2xl font-medium text-gray-800">
                    Страница не найдена
                </p>
                <p className="text-gray-600">
                    Кажется, вы попали на несуществующую страницу. Вернитесь на главную или воспользуйтесь навигацией.
                </p>
                <button
            onClick={() => handleGoBack()}
            className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                />
            </svg>
            {/* Текст "Назад" */}
            <span className="text-lg font-medium ml-3">Назад</span>
        </button>
            </div>
        </div>
    );
};

export default NotFoundPage;