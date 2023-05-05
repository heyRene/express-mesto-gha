const User = require('../models/user');
const { errors } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(errors.codes.SERVER_ERROR);
      res.send({ message: 'Произошла ошибка на сервере' });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(errors.codes.NOT_FOUND);
      res.send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.BAD_REQUEST);
        res.send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(errors.codes.BAD_REQUEST);
        res.send({ message: 'Передан некорректный id' });
      } else {
        res.status(errors.codes.SERVER_ERROR);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send({ newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.BAD_REQUEST);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.SERVER_ERROR);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const updateUserProfile = (req, res, data) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, data, { new: true, runValidators: true })
    .orFail(() => {
      res.status(errors.codes.NOT_FOUND);
      res.send({ message: 'Пользователь c указанным _id не найден.' });
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.BAD_REQUEST);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.SERVER_ERROR);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUserProfile(req, res, { name, about });
};
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserProfile(req, res, { avatar });
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUserInfo,
};
