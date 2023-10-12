import axios from 'axios';

export const getProductByProductCode = async (productCode: string) => {
  const productCodeBase64 = Buffer.from(productCode).toString('base64');
  const { data } = await axios.get(`/api/product/${productCodeBase64}`);
  return data;
};
