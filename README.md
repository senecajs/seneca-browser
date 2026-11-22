![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/browser

[![npm version](https://img.shields.io/npm/v/@seneca/browser.svg)](https://npmjs.com/package/@seneca/browser)
[![build](https://github.com/senecajs/seneca-browser/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-browser/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-browser/badge.svg)](https://snyk.io/test/github/senecajs/seneca-browser)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-browser/badge.svg?branch=master)](https://coveralls.io/github/senecajs/seneca-browser?branch=master)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install @seneca/browser
```

The package is a browser bundle, `seneca-browser.js`, that embeds
Seneca 4.0.0. It exports the Seneca factory as the global `Seneca` (or as
a UMD module). It has no peer dependency: do not install `seneca` next to
it for the browser. Up to 7.x the package was named `seneca-browser`.

The bundle uses ES2022 syntax (class fields, optional chaining), so it
needs a browser from 2021 or later.

## Quick Example

```html
<script src="seneca-browser.js"></script>
<script>
  const seneca = Seneca({
    plugin: { browser: { endpoint: '/seneca' } },
  }).client({ type: 'browser', pin: 'a:*' })

  seneca.post('a:1,x:1').then((out) => console.log(out))
</script>
```

The bundle loads its `browser` plugin itself. The `browser` client
transport posts each message as JSON, with `fetch`, to a gateway endpoint,
such as one served by [@seneca/gateway](https://github.com/senecajs/seneca-gateway)
and [@seneca/gateway-express](https://github.com/senecajs/seneca-gateway-express).

Options of the `browser` plugin, given as `plugin: { browser: { ... } }`:

* `endpoint`: the URL to post to (default `/seneca`), or a function
  `(msg, config, meta)` that returns the URL.
* `headers`: extra request headers. A value can be an (async) function.
* `fetch`: extra `fetch` options.
* `pathmap`: `{ pattern: { endpoint, prefix, suffix } }`, to post the
  messages that match a pattern to another URL.

A message with `debounce$: true` is dropped, with an empty result, while
an earlier message of the same pattern is still in flight.

## More Examples

See [test/](test/) for usage examples.

## Motivation

Allows Seneca to run in the browser, sending messages to server-side
microservices over HTTP through a gateway.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-browser/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)

## API

See [source](https://github.com/senecajs/seneca-browser) for API details.

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

The tests load the built bundle, `seneca-browser.js`, in Node.js. Build it
first:

```sh
npm run build
npm test
```

`npm run smoke` starts a server on port 8181 with a page for a manual test
in a real browser.

## Background

Experimental plugin for browser-side Seneca usage.
