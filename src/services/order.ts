import { FilterQuery } from 'mongoose';
import { IOrderDocument, Order } from '../models/order';
import { connectToDatabase } from '../utils';
import { ProductShipmentEntry } from '../types';

connectToDatabase();

export const getOrderById = (id: string) => {
  return Order.findById(id).lean();
};

export const getOrdersForManager = (filter: FilterQuery<IOrderDocument>) => {
  return Order.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'products.productCode',
        foreignField: 'productCode',
        as: 'productDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'userId',
        as: 'userData',
      },
    },
    {
      $unwind: {
        path: '$userData',
      },
    },
    {
      $addFields: {
        products: {
          $map: {
            input: '$products',
            as: 'orderProduct',
            in: {
              $mergeObjects: [
                '$$orderProduct',
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$productDetails',
                        as: 'productDetail',
                        cond: {
                          $eq: [
                            '$$orderProduct.productCode',
                            '$$productDetail.productCode',
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        productDetails: 0,
        'userData.password': 0,
      },
    },
  ]);
};

export const getOrders = (filter: FilterQuery<IOrderDocument>) => {
  return Order.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'products.productCode',
        foreignField: 'productCode',
        as: 'productDetails',
      },
    },
    {
      $addFields: {
        products: {
          $map: {
            input: '$products',
            as: 'orderProduct',
            in: {
              $mergeObjects: [
                '$$orderProduct',
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$productDetails',
                        as: 'productDetail',
                        cond: {
                          $eq: [
                            '$$orderProduct.productCode',
                            '$$productDetail.productCode',
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        productDetails: 0,
      },
    },
  ]);
};

export const updateStatusDeliveryStart = async (
  orderId: string,
  productShipmentEntries: ProductShipmentEntry[],
  deliveryInfo: string
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }

  order.status = 3;
  order.deliveryStartedAt = new Date();
  order.deliveryInfo = deliveryInfo;

  for (const productEntry of productShipmentEntries) {
    const product = order.products.find(
      product => product.productCode === productEntry.productCode
    );

    if (!product) {
      throw new Error('ORDER: 해당하는 상품을 찾을 수 없습니다.');
    }

    product.discountRate = productEntry.discountRate / 100;
    product.quantity = productEntry.quantity;
  }

  await order.save();

  return order;
};

export const updateStatusDeliveryCompleted = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }

  order.status = 4;
  order.deliveredAt = new Date();

  await order.save();

  return order;
};
