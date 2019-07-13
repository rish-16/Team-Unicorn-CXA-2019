
const alpha = require('alphavantage')({key:'4SBDNTEZM8QERWY7'})

alpha.data.intraday(`msft`).then(data => {
  console.log(data);
});

alpha.data.batch([`msft`, `aapl`]).then(data => {
  console.log(data);
});

alpha.forex.rate('btc', 'usd').then(data => {
  console.log(data);
})

alpha.crypto.daily('btc', 'usd').then(data => {
  console.log(data);
})
