const { google } = require('googleapis');
const creds = require('./credentials.json');

async function run() {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const id = '1EyZasTZEH9UosnzWAcWwM-v0l-YPH77K_kzKx8wS_K0';
  const res = await sheets.spreadsheets.get({ spreadsheetId: id });
  const titles = res.data.sheets.map(s => s.properties.title);
  for (const t of titles) {
    try {
      const d = await sheets.spreadsheets.values.get({ spreadsheetId: id, range: `${t}!A1:Z1` });
      console.log(`TAB: ${t}`);
      console.log(d.data.values ? d.data.values[0] : 'EMPTY');
    } catch(e) {}
  }
}
run();
