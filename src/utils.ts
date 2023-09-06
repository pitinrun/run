import mongoose, { connect, mongo } from 'mongoose';

const {
  // Attempts to connect to MongoDB and then tries to connect locally:)
  // MONGO_URI = 'mongodb://localhost:27017/next_test'
  MONGO_URI = '',
} = process.env;

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

// const connection: {
//   isConnected?: number;
// } = {};

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log('=> using existing database connection');
    return;
  }

  mongoose.set('debug', true);

  if (MONGO_URI) {
    const db = await mongoose.connect(MONGO_URI, options);
    // connection.isConnected = db.connections[0].readyState;
    console.log('=> using new database connection');
  }
};
