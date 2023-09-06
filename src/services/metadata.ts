import { MetaData } from 'src/models/metadata';
import { connectToDatabase } from '../utils';

connectToDatabase();

export const updateStorageNames = (storageNames: string[]) => {
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
