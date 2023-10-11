import axios from 'axios';

export type OrderDetailType = {
  discountRate: number;
  totalQuantity: number;
  totalFactoryPrice: number;
  stocks: {
    [storageName: string]: number;
  };
};

export type OrderInfoType = {
  [productCode: string]: OrderDetailType;
};
/**
 * @bodySample
 * [
    {
        "productCode": "PSR0N165",
        "shipments": [
            [
                "산동",
                4
            ]
        ]
    }
]
 * @param param0 
 */
export const orderProduct = async (orderInfos: OrderInfoType) => {
  const body = Object.entries(orderInfos).map(([productCode, orderDetail]) => {
    return {
      productCode,
      shipmentEntries: Object.entries(orderDetail.stocks)
        .filter(orderInfo => {
          return orderInfo[1] > 0;
        })
        .map(([storageName, quantity]) => {
          return [storageName, quantity];
        }),
    };
  });

  const response = await axios.put('/api/product/shipments', body);
  return response.data;
};
