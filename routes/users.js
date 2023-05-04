const usersRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserId);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
