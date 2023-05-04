const User = require('../models/user');
const { errors } = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.badRequest);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.serverError);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
      next(err);
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(errors.codes.serverError);
      res.send({ message: 'Произошла ошибка на сервере' });
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send({ newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.badRequest);
        res.send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(errors.codes.serverError);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Пользователь c указанным _id не найден.' });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.badRequest);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.serverError);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Пользователь c указанным _id не найден.' });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.badRequest);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.serverError);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
      next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUserInfo,
};
