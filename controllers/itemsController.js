const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const { mapResults, mapItemInfo } = require('../utils/mappers');

exports.getUserInfo = catchAsync(async (req, _, next) => {
  const { data: user } = await axios.get(process.env.USER_URL);

  req.user = {
    nickname: user.nickname,
  };
  next();
});

exports.getQueryResults = catchAsync(async (req, res) => {
  const { q } = req.query;
  const user = req.user;
  const LIMIT = 4;

  const { data: productsResults } = await axios.get(
    `${process.env.SEARCH_URL}?q=${q}&limit=${LIMIT}`
  );

  const products = productsResults.results;
  const categoryId = products?.[0]?.category_id;
  const categories = [];

  if (categoryId) {
    const { data: category } = await axios(
      `${process.env.CATEGORIES_URL}${categoryId}`
    );
    category?.path_from_root?.forEach((cat) => {
      categories.push(cat?.name);
    });
  }

  const response = await mapResults({ user, products, categories });

  res.status(200).json(response);
});

exports.getItemInfo = catchAsync(async (req, res) => {
  const { itemId } = req.params;
  const user = req.user;

  const { data: item } = await axios(`${process.env.ITEMS_URL}${itemId}`);
  const { data: description } = await axios(
    `${process.env.ITEMS_URL}${itemId}/description`
  );

  const response = mapItemInfo({ user, item, description });
  res.status(200).json(response);
});
