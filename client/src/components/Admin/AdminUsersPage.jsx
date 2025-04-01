import { observer } from "mobx-react-lite";
import { store } from "../../stores/store";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faUserShield, faTimes } from "@fortawesome/free-solid-svg-icons";

const AdminUsersPage = observer(() => {
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [createErrors, setCreateErrors] = useState({});

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await store.getUsers();
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
      if (userToBan.role === "administrator") {
        setError("Нельзя заблокировать администратора.");
        return;
      }
      await store.banUser(userId, !isBanned);
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

  // Создание пользователя
  const handleCreateUser = async () => {
    try {
      setCreateErrors({});
      await store.createUser(newUser);
      setIsSidebarOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      await store.getUsers();
    } catch (err) {
      if (err.response?.data?.message) {
        const message = err.response.data.message;
        if (message.includes('никнейм') || message.includes('email')) {
          setCreateErrors(prev => ({ ...prev, username: message }));
        }
      } else {
        setCreateErrors(prev => ({ ...prev, general: 'Ошибка при создании пользователя' }));
      }
    }
  };

  // Изменение роли
  const handleRoleChange = async (userId, newRole) => {
    try {
      await store.updateUserRole(userId, newRole);
      await store.getUsers();
    } catch (err) {
      setError("Не удалось изменить роль пользователя.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen flex flex-col">
      {/* Шапка */}
      <header className="bg-white shadow-xl rounded-b-3xl p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Управление пользователями
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Новый пользователь
          </button>
        </div>
      </header>

      {/* Боковая панель для создания пользователя */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl p-6 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Создать пользователя</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                createErrors.username ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-pink-500"
              }`}
            />
            {createErrors.username && (
              <p className="text-red-500 text-sm mt-1">{createErrors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="user">Пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
        </div>
        {createErrors.general && (
          <p className="text-red-500 text-sm mt-4">{createErrors.general}</p>
        )}
        <button
          onClick={handleCreateUser}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
        >
          Создать
        </button>
      </div>

      {/* Оверлей для боковой панели */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Основной контент */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-md text-center animate-fade-in">
            {error}
          </div>
        )}

        {store.users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "moderator"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" ? "Админ" : user.role === "moderator" ? "Модератор" : "Пользователь"}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`font-medium text-sm ${
                      user.banned ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {user.banned ? "Заблокирован" : "Активен"}
                  </span>
                  {user.role !== "admin" && (
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
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`w-full px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : user.role === "moderator"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                    disabled={user._id === store.user._id}
                  >
                    <option value="user">Пользователь</option>
                    <option value="moderator">Модератор</option>
                    <option value="admin">Администратор</option>
                  </select>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl shadow-xl">
            <p className="text-gray-600 text-lg">Нет пользователей.</p>
          </div>
        )}
      </main>
    </div>
  );
});

export default AdminUsersPage;