const Card = require('../models/card');
const { errors } = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
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

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
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

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Карточка c указанным _id не найдена' });
    })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      next(err);
    });
};

const setLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Передан несуществующий _id карточки' });
    })
    .then((card) => {
      res.send(card);
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
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(errors.codes.notFound);
      res.send({ message: 'Передан несуществующий _id карточки.' });
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errors.codes.badRequest);
        res.send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errors.codes.serverError);
        res.send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deleteLike,
};
