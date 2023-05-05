const Card = require('../models/card');
const { errors } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(errors.codes.SERVER_ERROR);
      res.send({ message: 'Произошла ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ card });
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(errors.codes.NOT_FOUND);
      res.send({ message: 'Карточка c указанным _id не найдена' });
    })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
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

const setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(errors.codes.NOT_FOUND);
      res.send({ message: 'Передан несуществующий _id карточки' });
    })
    .then((card) => {
      res.send(card);
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
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(errors.codes.NOT_FOUND);
      res.send({ message: 'Передан несуществующий _id карточки.' });
    })
    .then((card) => {
      res.send(card);
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

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  deleteLike,
};
