import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IMetaData {
  storageNames: {
    name: string;
    code: string;
  }[]; // NOTE: product에 속한 storages names example: 산동, 천안, 동남 ...
}

export interface IMetaDataDocument extends Document, IMetaData {}

const MetaDataSchema: Schema = new Schema(
  {
    storageNames: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export const MetaData = (mongoose.models.MetaData ||
  model('MetaData', MetaDataSchema)) as Model<IMetaDataDocument>;
