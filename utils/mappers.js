const { default: axios } = require('axios');

const mapProducts = async (product) => {
  const [amount, decimals] = (product.sale_price.amount + '').split('.');
  const { data: currency } = await axios(
    `${process.env.CURRENCIES_URL}${product.sale_price.currency_id}`
  );
  return {
    id: product?.id,
    title: product?.title,
    price: {
      currency: currency?.id,
      amount: +amount,
      decimals: +(decimals || 0),
    },
    picture: product?.thumbnail,
    condition: product?.condition,
    free_shipping: product?.shipping?.free_shipping,
  };
};

exports.mapResults = async ({ user, products, categories }) => {
  const mappedResponse = {};

  const [name, lastname] = user.nickname.split(' ');
  const items = await Promise.all(products.map(mapProducts));

  mappedResponse['author'] = {
    name,
    lastname,
  };
  mappedResponse['categories'] = categories;
  mappedResponse['items'] = items;

  return mappedResponse;
};

const mapItem = (item, description) => {
  const [amount, decimals] = (item?.price + '').split('.');
  return {
    id: item?.id,
    title: item?.title,
    price: {
      currency: item?.currency_id,
      amount: +amount,
      decimals: +(decimals || 0),
    },
    picture: item?.pictures?.[0]?.secure_url,
    condition: item?.condition,
    free_shipping: item?.shipping?.free_shipping,
    sold_quantity: item?.sold_quantity,
    description: description?.plain_text,
  };
};

exports.mapItemInfo = ({ user, item, description }) => {
  const mappedResponse = {};
  const [name, lastname] = user.nickname.split(' ');

  mappedResponse['author'] = {
    name,
    lastname,
  };
  mappedResponse['item'] = mapItem(item, description);

  return mappedResponse;
};
