/**
 * ONELIFE 官網表單 → Google 試算表 + Email 通知
 * 設定方式見同資料夾 README.md
 */
var SHEET_ID = '';               // 試算表 ID（網址 /d/ 和 /edit 之間那串）
var NOTIFY_TO = 'onelifetaiwan@gmail.com';
var PDF_LINKS = {                // 兩份方案 PDF 的 Google 雲端「任何人可檢視」連結
  '企業版': '',
  '學校版': ''
};

function doPost(e) {
  var data = JSON.parse(e.postData.contents || '{}');
  var type = data['類型'] || '其他';
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(type) || ss.insertSheet(type);
  var keys = Object.keys(data);
  if (sh.getLastRow() === 0) sh.appendRow(keys);
  var header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  keys.forEach(function (k) { if (header.indexOf(k) < 0) { sh.getRange(1, header.length + 1).setValue(k); header.push(k); } });
  sh.appendRow(header.map(function (h) { return data[h] || ''; }));

  var lines = keys.map(function (k) { return k + '：' + data[k]; }).join('\n');
  MailApp.sendEmail(NOTIFY_TO, '[官網] ' + type + ' ' + (data['單位'] || data['Email'] || ''), lines);

  if (type === '下載PDF' && data['Email'] && PDF_LINKS[data['版本']]) {
    MailApp.sendEmail(data['Email'], 'ONELIFE ' + data['版本'] + '方案', '您好，這是 ONELIFE 日月潭' + data['版本'] + '方案：\n' + PDF_LINKS[data['版本']] + '\n\n有任何想法歡迎直接回信或加 LINE @onelife。\n\n日月潭戶外運動專家有限公司\n0987-678-494');
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet() { return ContentService.createTextOutput('ONELIFE form endpoint OK'); }
