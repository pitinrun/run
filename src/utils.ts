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

// export const connectGoogleSheet = async () => {
//   const authorize = new google.auth.JWT(client_email, undefined, private_key, [
//     'https://www.googleapis.com/auth/spreadsheets'
//   ])
//   const googleSheet = google.sheets({
//     version: 'v4',
//     auth: authorize,
//   });

//   const context = await googleSheet.spreadsheets.values.get({
//     spreadsheetId: '165omGujGf-3I5zdWQV-U4dNTkJor6X0OpNPaUAZ2LJA',
//     range: 'A1:A3',
//   });

//   console.log('$$ context', context.data.values);
// }

// connectGoogleSheet();