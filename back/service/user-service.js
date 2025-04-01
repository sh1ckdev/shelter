const UserModel = require('../models/user-modal');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error'); 

class UserService {
    async registration(username, email, password, role = 'user') {
        // Проверяем отдельно username и email
        const usernameCandidate = await UserModel.findOne({ username });
        if (usernameCandidate) {
            throw ApiError.BadRequest('Пользователь с таким именем уже существует');
        }
        
        const emailCandidate = await UserModel.findOne({ email });
        if (emailCandidate) {
            throw ApiError.BadRequest('Email уже используется');
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({ username, email, password: hashedPassword, role });
    
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {
            ...tokens,
            user: userDto,
        };
    }
    
    async login(username, password) {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким никнеймом не найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
    
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
    
        return {
            ...tokens,
            user: userDto,
        };
    }


    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
async refresh(refreshToken) {

    if (!refreshToken) {
        throw ApiError.UnauthorizedError();
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
}

    async updateProfile(fieldsToUpdate, userId) {
        try {
            const currentUser = await UserModel.findById(userId);
    
            if (!currentUser) {
                throw ApiError.NotFound('Пользователь не найден');
            }
    
            const { username, password, email, oldPassword, newPassword } = fieldsToUpdate;
            const updatedFields = {
                username: (username && username.trim()) || currentUser.username,
                email: (email && email.trim()) || currentUser.email,
            };
            
            // Проверка старого пароля при смене пароля
            if (newPassword) {
                if (!oldPassword) {
                    throw ApiError.BadRequest('Необходимо ввести текущий пароль');
                }
                
                const isPassEquals = await bcrypt.compare(oldPassword, currentUser.password);
                if (!isPassEquals) {
                    throw ApiError.BadRequest('Неверный текущий пароль');
                }
                
                updatedFields.password = await bcrypt.hash(newPassword, 3);
            }

            const newUsername = updatedFields.username;
    
            if (newUsername && newUsername !== currentUser.username) {
                const existingUser = await UserModel.findOne({ username: newUsername });
    
                if (existingUser) {
                    throw ApiError.BadRequest('Никнейм уже используется');
                }
            }
    
            Object.assign(currentUser, updatedFields);
    
            await currentUser.save();
    
            const userDto = new UserDto(currentUser);
            return userDto 
        } catch (error) {
            throw error;
        }
    }  

    async deleteUser(userId) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(userId);
            return deletedUser;
        } catch (error) {
            
        }
    }

    async getUser(username){
        try {
            const user = await UserModel.findOne({username}).select("-password -email -refreshToken");
            console.log(user)
            return user;
        } catch(error) {

        }
    }
    async banUser(userId, isBanned) {
        try {
            const user = await UserModel.findById(userId);
            console.log(isBanned)
            user.banned = isBanned;
            await user.save();
        } catch(error) {
            throw error;
        }
    }

    async createUser(username, email, password, role = 'user') {
        try {
            const candidate = await UserModel.findOne({ $or: [{ username }, { email }] });
            if (candidate) {
                throw ApiError.BadRequest('Пользователь с таким никнеймом или email уже существует');
            }
            const hashedPassword = await bcrypt.hash(password, 3);
            const user = await UserModel.create({ username, email, password: hashedPassword, role });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }
            if (!['user', 'moderator', 'admin'].includes(newRole)) {
                throw ApiError.BadRequest('Недопустимая роль');
            }
            user.role = newRole;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
