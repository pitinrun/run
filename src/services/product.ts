import { Product } from '../models/product';
import { IProduct, ProductShipmentEntry } from '../types';
import { connectToDatabase } from '../utils';

connectToDatabase();

export const getProductsByProductCodes = async (productCodes: string[]) => {
  return Product.find({
    productCode: {
      $in: productCodes,
    },
  }).lean();
};

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
    // NOTE: Slice 500 items and bulkWrite
    for (let i = 0; i < bulkOption.length; i += 500) {
      const result = await Product.bulkWrite(bulkOption.slice(i, i + 500));
      // console.log('$$ result: ', result);
    }
  } catch (error) {
    console.error('!! ERROR: ', error.message);
    return false;
  }

  return true;
};

export const updateProductStorage = async (
  productShipmentEntries: ProductShipmentEntry[]
) => {
  /**
   * @plan
   * 1. 해당하는 product 데이터들을 가져와서 재고 여분이 있는지 확인
   * 2. product 데이터에 재고 여분이 파악
   * 3. 해당 storageName의 재고를 업데이트
   * 4. 만약, 재고 여분이 없으면 에러 출력, 에러에는 유지보수를 위해 mongo error 명시
   * 5. 만약, 해당하는 productCode가 없으면 에러 출력, 에러에는 유지보수를 위해 mongo error 명시
   * 6. 성능을 위해서 데이터베이스 송신은 병렬로 처리할 것
   * 7. order 상태 업데이트
   * 8. 결과 반환
   */

  /**
   * @note 해당하는 product 데이터들을 가져와서 재고 여부 있는지 확인
   */
  for (const productShipmentEntry of productShipmentEntries) {
    const { productCode, shipmentEntries } = productShipmentEntry;

    const product = await Product.findOne({
      productCode,
    });

    if (!product) throw new Error('MONGO: Not found product ' + productCode);

    /**
     * @note product 데이터에 재고 여분이 있는지 확인
     */
    if (product) {
      const storages = product.storages;

      for (const shipmentEntry of shipmentEntries) {
        const [storageName, quantity] = shipmentEntry;

        const storage = storages.find(storage => storage.name === storageName);

        if (!storage)
          throw new Error('MONGO: Not found storage ' + storageName);

        if (storage) {
          if (storage.stock < quantity)
            throw new Error(
              `MONGO: ${storageName}에 ${product.patternKr} 재고가 부족합니다.`
            );
        }
      }
    }
  }

  /**
   * @note product 데이터에 재고 여분이 있으면 해당 storageName의 재고를 업데이트
   */
  const updatePromises = productShipmentEntries.map(
    async productShipmentEntry => {
      const { productCode, shipmentEntries } = productShipmentEntry;

      const product = await Product.findOne({
        productCode,
      });

      for (const shipmentEntry of shipmentEntries) {
        const [storageName, quantity] = shipmentEntry;

        product?.storages.forEach(storage => {
          if (storage.name === storageName) {
            storage.stock -= quantity;
          }
        });
      }
      return product?.save();
    }
  );

  await Promise.all(updatePromises);

  return true;
};
