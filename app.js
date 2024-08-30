const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const itemsRouter = require('./routes/itemsRouter');
const AppError = require('./utils/AppError');
const GeneralErrorHandler = require('./controllers/errorController');

const app = express();

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(compression());

app.use('/api/items', itemsRouter);

app.all('*', (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GeneralErrorHandler);

module.exports = app;
