
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

      // don't cache between environments
      var dev = this.dev ? '1' : '0';
      var compile = options.string ? '1' : '0';
      var hash = dev + compile + calculate(string);

      var opts = {
        filename: file.filename,
        pretty: options.pretty,
        self: options.self,
        debug: options.debug,
        compileDebug: this.dev,
        compiler: options.compiler,
        globals: options.globals,
      };

      // compile into HTML string
      if (options.string) {
        try {
          file.string =
          cache[hash] = cache[hash]
            || JSON.stringify(Jade.render(string, opts));
        } catch (err) {
          done(err);
          return;
        }

        file.extension = 'html';
        file.define = true;
        done();
        return
      }

      // compile into a JS fn
      var res;
      try {
        res =
        cache[hash] = cache[hash]
          || Jade.compileClient(string, opts);
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
