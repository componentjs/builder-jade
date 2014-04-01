# builder-jade

Jade plugin for [component-builder2](https://github.com/component/builder2.js).

- Caches compilations
- Either include the runtime as a dependency or a global
- Compiles the debugging version in development environment
- Option to compile the template to an HTML string

## Example

```js
var fs = require('fs');
var build = require('component-builder2');
var jade = require('builder-jade');

build.scripts(nodes)
  .use('scripts', build.plugins.js())
  .use('templates', build.plugins.string())
  .use('templates', jade({
    string: true,
  }))
  .use('jade', jade({
    runtime: false,
  }))
  .build(function (err, string) {
    if (err) throw err;

    fs.writeFileSync('build.js', string);
  })
```

You could put your jade files in `.templates` or create your own field like `.jade`.

Without the global runtime, you have to define the `visionmedia/jade` dependency in every component that uses jade templates. This is quite annoying:

```json
{
  "name": "widget",
  "dependencies": {
    "visionmedia/jade": "*"
  },
  "templates": [
    "index.jade"
  ]
}
```

If you want to avoid this as, use the global runtime.

## Options

Plugin options:

- `string` - compile the template as an HTML string instead of a function.
- `runtime` - use the global runtime instead of using a local `jade` dependency. See below.

Jade options:

- `pretty`
- `self`
- `debug`
- `compiler`
- `globals`

## Global Runtime

You may use the global runtime by prepending `jade.runtime` to your build and using the `.runtime` option:

```js
build.scripts(nodes)
  .use('templates', jade({
    runtime: true
  }))
  .build(function (err, string) {
    if (err) throw err;
    string = jade.runtime + string;
    fs.writeFileSync('build.js', string);
  })
```

This will create a global `jade` variable. However, the benefits are:

- Smaller `.js` build
- No more defining `visionmedia/jade` as a dependency in every component

However, you now essentially have to manage this dependency yourself.

## License

The MIT License (MIT)

Copyright (c) 2014 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.