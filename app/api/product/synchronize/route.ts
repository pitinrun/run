import Validate from 'next-api-validation'
import { NextResponse } from 'next/server'
import { Post, IPost } from 'src/Models'
import { connectToDatabase } from 'src/utils'
import { google } from 'googleapis'
import { client_email, private_key } from '.meta/google-credentials.json'

connectToDatabase()

const START_CELL = 'A6'

const { SPREAD_SHEET_ID, SPREAD_SHEET_PRODUCT_NAME } = process.env

async function getSheetRange(
  spreadsheetId: string = SPREAD_SHEET_ID ?? '',
  sheetName: string = SPREAD_SHEET_PRODUCT_NAME ?? ''
) {
  const authorize = new google.auth.JWT(client_email, undefined, private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
  ])

  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize
  })

  // 스프레드시트의 메타데이터를 먼저 가져옵니다.
  const sheetMetadata = await googleSheet.spreadsheets.get({
    spreadsheetId
  })

  // 첫 번째 시트의 정보를 가져옵니다. (여러 시트가 있을 수 있으므로 필요하면 수정)
  if (!sheetMetadata.data.sheets) {
    throw new Error('No sheet found')
  }

  const sheetInfo = sheetMetadata.data.sheets.find(
    sheet => sheet.properties?.title === sheetName
  )

  if (!sheetInfo?.properties?.gridProperties) {
    throw new Error('No gridProperties found')
  }

  const rowCount = sheetInfo.properties.gridProperties.rowCount
  const colCount = sheetInfo.properties.gridProperties.columnCount

  return {
    rowCount,
    colCount
  }
}

async function getSpreadSheetData() {
  const authorize = new google.auth.JWT(client_email, undefined, private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
  ])
  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize
  })

  // const context = await googleSheet.spreadsheets.values.get({
  //   spreadsheetId: '165omGujGf-3I5zdWQV-U4dNTkJor6X0OpNPaUAZ2LJA',
  //   range: 'A1:A3'
  // })

  const context = await googleSheet.spreadsheets.get({
    spreadsheetId: SPREAD_SHEET_ID
    // range: 'A1:A3'
  })

  return context

  // return context.data.values;
}

export async function GET() {
  try {
    // const posts = await Post.find()
    // return NextResponse.json(posts.reverse())
    // TODO: 여기에 데이터베이스랑 spread sheet랑 동기화 하는 코드 작성
    const sheetRange = await getSheetRange()
    // const spreadSheetData = await getSpreadSheetData()
    // const spreadSheetData = await getSpreadSheetData()
    return NextResponse.json({
      message: 'success',
      data: sheetRange,
      status: 200
    })
  } catch (error) {
    console.log('$$ error', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: 500,
          message: error.message
        },
        {
          status: 500
        }
      )
    }

    return NextResponse.json('unknown error', {
      status: 500
    })
  }
}
