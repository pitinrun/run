import { IMetaData, MetaData } from 'src/models/metadata';
import { connectToDatabase } from '../utils';

connectToDatabase();

export const updateStorageNames = (storages: IMetaData['storages']) => {
  return MetaData.findOneAndUpdate(
    {},
    { storages },
    { upsert: true, new: true }
  );
};

export const getStorages = async () => {
  const metaData = await MetaData.findOne({});

  if (!metaData) {
    return [];
  }

  return metaData.storages;
};
