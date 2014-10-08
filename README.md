Sudoer
======

Simple sudo wrapper with an exec() interface.

Example
-------

    var sudoer = require('sudoer'),
        cmd = '/some/command/that/requires/root/privileges',

    sudoer.exec(cmd, function(err, stdout, stderr) {
      if (err) return console.log(err); // Requires sudo privileges
    })

Credits, Copyright.
------------------

Written by Tomas Pollak. MIT license.
