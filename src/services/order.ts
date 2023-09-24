import { FilterQuery } from 'mongoose';
import { IOrderDocument, Order } from '../models/order';
import { connectToDatabase } from '../utils';

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
