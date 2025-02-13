// middlewares/moderatorMiddleware.js
const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service'); // Убедитесь, что tokenService импортирован

module.exports = function (req, res, next) {
    try {
        // Проверяем наличие заголовка Authorization
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError('Отсутствует заголовок авторизации'));
        }

        // Извлекаем токен из заголовка
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError('Токен доступа не предоставлен'));
        }

        // Валидируем токен
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError('Недействительный токен доступа'));
        }

        // Проверяем роль пользователя
        if (userData.role !== 'moderator' && userData.role !== 'admin') {
            return next(ApiError.Forbidden('Доступ запрещен. Требуются права модератора или администратора.'));
        }

        // Если все проверки пройдены, передаем управление следующему middleware
        next();
    } catch (e) {
        // Обрабатываем любые непредвиденные ошибки
        return next(ApiError.UnauthorizedError('Ошибка при проверке прав доступа'));
    }
};