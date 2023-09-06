import { IProduct, Product } from '../models/product';

export const dropAndBulkInsertProducts = async (products: IProduct[]) => {
  try {
    await Product.deleteMany({});
  } catch (error) {
    console.error('!! ERROR: ', error.message);
    return false;
  }

  const bulkOption = products.map(product => ({
    insertOne: {
      document: product,
    },
  }));

  try {
    await Product.bulkWrite(bulkOption);
  } catch (error) {
    console.error('!! ERROR: ', error.message);
    return false;
  }

  return true;
};
