
var fs = require('fs');
var Jade = require('jade');
var crypto = require('crypto');

var cache = Object.create(null);

exports = module.exports = function (options) {
  options = options || {};

  return function jade(file, done) {
    if (file.extension !== 'jade') return done();
    file.read(function (err, string) {
      if (err) return done(err);

      var dev = this.dev ? '1' : '0';
      // don't cache between environments
      var hash = dev + file.filename + '#' + calculate(string);
      var res;
      try {
        res = cache[hash] = cache[hash] || Jade.compileClient(string, {
          filename: file.filename,
          compileDebug: this.dev
        });
      } catch (err) {
        done(err);
        return;
      }

      file.extension = 'js';

      if (options.runtime) {
        file.string = res;
        file.define = true;
      } else {
        file.string = 'var jade = require("jade");\n'
          + 'module.exports = ' + res;
      }

      done();
    })
  }
}

// smaller browser-specific runtime
exports.runtime = '(function (exports) {\n'
  + fs.readFileSync(require.resolve('jade/lib/runtime'), 'utf8')
  + '\n})(this.jade = {});\n\n';

function calculate(string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}
