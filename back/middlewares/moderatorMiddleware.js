// middlewares/moderatorMiddleware.js
const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
    try {
        const user = req.user; 
        console.log(user);

        if (user.role !== 'moderator' && user.role !== 'admin') {
            return next(ApiError.Forbidden('Доступ запрещен. Требуются права модератора или администратора.'));
        }

        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};