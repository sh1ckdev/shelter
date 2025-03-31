import { observer } from "mobx-react-lite";
import { store } from "../../stores/store";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AdminUsersPage = observer(() => {
  const [error, setError] = useState(null);


  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await store.getUsers();
        console.log(store.users);
      } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
        setError("Не удалось загрузить пользователей.");
      }
    };
    fetchUsers();
  }, []);

  // Блокировка/разблокировка пользователя
  const handleBanUser = async (userId, isBanned) => {
    try {
      const userToBan = store.users.find((user) => user._id === userId);
      if (userToBan.role === "admin") {
        setError("Нельзя заблокировать администратора.");
        return;
      }

      await store.banUser(userId, !isBanned); // Переключаем статус блокировки
      await store.getUsers();
      setError(null);
    } catch (err) {
      console.error("Ошибка при блокировке пользователя:", err);
      setError("Не удалось заблокировать пользователя.");
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = store.users.find((user) => user._id === userId);
      if (userToDelete.role === "administrator") {
        setError("Нельзя удалить администратора.");
        return;
      }

      await store.deleteUser(userId);
      await store.getUsers();
      setError(null);
    } catch (err) {
      console.error("Ошибка при удалении пользователя:", err);
      setError("Не удалось удалить пользователя.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen flex flex-col">
      {/* Шапка */}
      <header className="bg-white shadow-xl rounded-b-3xl p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Управление пользователями
          </h1>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-grow flex justify-center px-4 py-8">
        <div className="max-w-6xl w-full">
          {/* Сообщение об ошибке */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-md text-center">
              {error}
            </div>
          )}

          {/* Таблица пользователей */}
          <div className="bg-white p-6 rounded-3xl shadow-xl overflow-x-auto">
            {store.users.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Пользователь
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Роль
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Статус
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {store.users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                    >
                      <td className="py-3 px-4 text-gray-800">
                        {user.username}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.role}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-medium ${
                            user.banned ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {user.banned ? "Заблокирован" : "Активен"}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-4">
                        {user.role !== "admin" && (
                          <>
                            <div
                              className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                                user.banned
                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                  : "bg-gradient-to-r from-green-500 to-green-600"
                              }`}
                              onClick={() => handleBanUser(user._id, user.banned)}
                            >
                              <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                                  user.banned ? "translate-x-0" : "translate-x-6"
                                }`}
                              ></div>
                            </div>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-1 px-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg flex items-center"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg">Нет пользователей.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
});

export default AdminUsersPage;