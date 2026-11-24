# Changes

## 8.0.0 2026-11-22

First entry of this change log. Earlier versions are on npm and in the git
history.

* Renamed from `seneca-browser` to `@seneca/browser`. The last stable
  release of the old name is `seneca-browser@7.1.0`. The 8.0.0
  prereleases (`8.0.0-rc1` to `8.0.0-rc4`) were published under the old
  name.
* The bundle `seneca-browser.js` embeds Seneca 4.0.0. 8.0.0-rc4 embedded
  the prerelease 4.0.0-rc4, and 7.1.0 a preview build of Seneca 4
  (`v4.0.0-t.2.p.6`). The package has no peer dependency, because the
  bundle carries its own Seneca.
* Seneca 4 reports deprecations with `process.emitWarning`, which the
  process shim of browserify lacks, so a deprecated call threw a
  `TypeError` inside the bundle. The bundle now gives the shim an
  `emitWarning` that writes the notice to `console.warn`, such as
  `[SENECA_DEP_ACT_IF] DeprecationWarning: ...`. Deprecations stay visible
  and are never fatal.
* The `browser` plugin is defined with `define` instead of the deprecated
  `init` (D4), so the bundle itself causes no deprecation notice.
* `Seneca.browser.version` is the package version (it said `7.1.0`).
* The bundle uses ES2022 syntax, as Seneca 4 does: class fields, optional
  chaining and nullish coalescing. It needs a browser from 2021 or later.
* Node.js 24 or later for development (`engines.node` `>=24`).
* Build: the `build` script declares what it uses (`@browserify/uglifyify`
  and `browser-pack-flat`). `browser-pack-flat` parses at ECMAScript 2020,
  so that it accepts the Seneca 4 code. Unused development dependencies
  are removed: `seneca` 3, the `seneca4` alias of 4.0.0-rc4,
  `seneca-entity`, `seneca-promisify`, `jest`, `tinyify`, `uglifyify`,
  `browserify-fs`, `browserify-header`, `timers` and `util.promisify`.
* Tests: real tests replace the empty one, on `node:test`. They load the
  built bundle in Node.js and cover local actions, `ready`, errors,
  `debounce$`, the deprecation regression, and the `browser` client
  transport against a local gateway (express with `@seneca/gateway` and
  `@seneca/gateway-express`), including remote errors (the error crash of
  8.0.0-rc3 and rc4), headers, endpoint functions and `pathmap`. One test
  loads the bundle as a classic script, as a `<script>` tag does, into a
  context with browser globals only and none of Node.js.
* Not tested: no test runs in a real browser. The tests run the bundle in
  Node.js, with the global `fetch` of Node.js. The manual page of
  `npm run smoke` was not run in a browser for this release.
