var sudoer = require('./');

sudoer('whoami', function(err, out) {
  console.log(err || out);
})
