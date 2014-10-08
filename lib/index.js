// simple sudo wrapper, written by Tomas Pollak.

var fs             = require('fs'),
    spawn          = require('child_process').spawn,
    which          = require('./which'),
    sudo_bin       = '/usr/bin/sudo',
    pass_required  = 'a password is required',
    sudo_args      = ['-n'];

module.exports = function(bin, args, cb) {

  // command can be passed in exec format on or spawn format, because we're cool.
  if (typeof args == 'function') {
    cb = args;
    args = bin.split(' ');
    bin = args.shift();
  }

  var abs_bin  = which(bin),
      all_args = sudo_args.concat([abs_bin].concat(args));

  // if bin does not match any non word char, then it means the command
  // was passed without an absolute path
  // var absolute_path = bin.match(/[^\w]/));

  if (!abs_bin)
    return cb(new Error('Command not found in path: ' + bin));

  // the return stuff
  var out = '',
      err = '',
      returned = false;

  var sudo_env = process.env;
  sudo_env.LANG = 'en'; // to avoid sudo i18n that breaks our out.match()

  var done = function(e) {
    if (returned) return;
    returned = true;
    cb(e, out, err);
  }

  var opts  = { stdio: 'pipe', env: sudo_env },
      child = spawn(sudo_bin, all_args, opts);

  child.stdout.on('data', function(data) {
    out += data.toString();
  })

  child.stderr.on('data', function(data) {
    if (data.toString().match(pass_required))
      return done(new Error('No sudo access for ' + bin));

    err += data.toString();
  })

  child.on('exit', function(code){
    process.nextTick(done);
  })
}
