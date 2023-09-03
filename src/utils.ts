import { connect, connection } from 'mongoose'
import { google } from 'googleapis'
import { client_email, private_key } from '../.meta/google-credentials.json'

const {
  // Attempts to connect to MongoDB and then tries to connect locally:)
  // MONGO_URI = 'mongodb://localhost:27017/next_test'
  MONGO_URI = ''
} = process.env

const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

export const connectToDatabase = async () => {
  if (!connection.readyState) {
    console.log('Connecting to ', MONGO_URI)
    connect(MONGO_URI, options)
  }
}
