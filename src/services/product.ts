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
    // console.log('bulkWrite ', bulkOption);
    // NOTE: Slice 1000 items and bulkWrite
    for (let i = 0; i < bulkOption.length; i += 500) {
      const result = await Product.bulkWrite(bulkOption.slice(i, i + 500));
    }
  } catch (error) {
    console.error('!! ERROR: ', error.message);
    return false;
  }

  return true;
};
