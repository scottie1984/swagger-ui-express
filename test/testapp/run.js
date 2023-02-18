var app = require('./app');

app.set('port', 3001);

app.listen(3001, function() {
  console.log('Example app listening on port 3001!')
})
