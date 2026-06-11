const { google } = require('googleapis');
const credentials = require('./credentials.json');

async function testSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1EyZasTZEH9UosnzWAcWwM-v0l-YPH77K_kzKx8wS_K0';

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    const sheetTitles = response.data.sheets.map(s => s.properties.title);
    console.log('Sheet Titles:', sheetTitles);

    for (const title of sheetTitles) {
      const range = `${title}!A1:M2`;
      const data = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      console.log(`\nData in ${title}:`, data.data.values);
    }
  } catch (error) {
    console.error('Error fetching sheet:', error.message);
  }
}

testSheet();
