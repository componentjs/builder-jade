var vm = require('vm')
var co = require('co')
var mkdirp = require('mkdirp')
var assert = require('assert')
var resolve = require('component-resolver')
var Builder = require('component-builder')
var join = require('path').join

var runtime = require('..').runtime
var options = {
  install: true
}

var output = '<html><head></head><body></body></html>'

function fixture(name) {
  return join(__dirname, 'fixtures', name)
}

function build(nodes, options) {
  return new Builder.scripts(nodes, options)
    .use('scripts', Builder.plugins.js())
    .use('jade', require('..')(options))
}

describe('jade', function () {
  var tree
  var js = Builder.scripts.require

  it('should install', co(function* () {
    tree = yield* resolve(fixture('jade'), options)
  }))

  it('should build', co(function* () {
    js += yield build(tree).end();
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("jade")() !== "'
      + output + '") throw new Error()', ctx)
  })
})

describe('jade-runtime', function () {
  var tree
  var js = Builder.scripts.require

  it('should install', co(function* () {
    tree = yield* resolve(fixture('jade-runtime'), options)
  }))

  it('should build', co(function* () {
    js += runtime
    js += yield build(tree, {
      runtime: true
    }).end();
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("jade-runtime")() !== "'
      + output + '") throw new Error()', ctx)
  })
})

describe('local', function () {
  var tree
  var js = Builder.scripts.require

  it('should install', co(function* () {
    tree = yield* resolve(fixture('local'), options)
  }))

  it('should build', co(function* () {
    js += runtime
    js += yield build(tree, {
      runtime: true
    }).end();
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("./lib/home")() !== "'
      + output + '") throw new Error()', ctx)
  })
})

describe('jade-string', function () {
  var tree
  var js = Builder.scripts.require

  it('should install', co(function* () {
    tree = yield* resolve(fixture('jade'), options)
  }))

  it('should build', co(function* () {
    js += yield build(tree, {
      string: true
    }).end();
  }))

  it('should execute', function () {
    var ctx = vm.createContext()
    vm.runInContext(js, ctx)
    vm.runInContext('if (require("jade") !== "'
      + output + '") throw new Error()', ctx)
  })
})
