import { IMetaData, MetaData } from 'src/models/metadata';
import { connectToDatabase } from '../utils';

connectToDatabase();

export const updateStorageNames = (storageNames: IMetaData['storageNames']) => {
  return MetaData.findOneAndUpdate(
    {},
    { storageNames },
    { upsert: true, new: true }
  );
};

export const getStorageNames = async () => {
  const metaData = await MetaData.findOne({});

  if (!metaData) {
    return [];
  }

  return metaData.storageNames;
};
