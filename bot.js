const express = require('express');
const app = express();

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
const TelegramBot = require('node-telegram-bot-api');
const { google } = require('googleapis');

// TELEGRAM BOT TOKEN
const token = '8392335540:AAHnIzouqVA2kOm9Em0FtLsu0K8dVhfwys0';

const bot = new TelegramBot(token, { polling: true });

// GOOGLE AUTH
const auth = new google.auth.GoogleAuth({
  keyFile: 'telegram-sales-bot.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// GOOGLE SHEET ID
const spreadsheetId = '19zjTH-HpP95CNjfrePRVWpf_eRRIl3xO-hyVyaBC110';

console.log("BOT STARTED");

bot.on('message', async (msg) => {

  const text = msg.text;

  if(text && text.startsWith('#lead')) {

    try {

      const data = text.replace('#lead ', '').split('|');

      const pocBrand = data[0].trim();
      const segment = data[1].trim();
      const comments = data[2].trim();

      const client = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: client });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Lead!A:C',
        valueInputOption: 'RAW',
        resource: {
          values: [[pocBrand, segment, comments]]
        }
      });

      bot.sendMessage(msg.chat.id, '✅ Lead added to sheet');

    } catch(error) {
      console.log(error);
      bot.sendMessage(msg.chat.id, '❌ Error adding lead');
    }
  }
});
