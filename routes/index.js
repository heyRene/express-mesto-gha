const router = require('express').Router();
const { errors } = require('../errors/errors');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  res.status(errors.codes.NOT_FOUND);
  res.send({ message: `Запрашиваемый ресурс по адресу '${req.path}' не найден` });
  next();
});

module.exports = router;
