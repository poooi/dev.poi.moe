---
id: api-introduction
title: API introduction
sidebar_label: Introduction
---

Generally, plugin benefits from rich and various API available in poi, including:

* HTML DOM API
* Chromium javascript API/features provided by Electron, depending on `Electron`'s chromium version
* Node.js built-in API, e.g. `fs`, `path`. It is depending on `Electron`'s node integration version
* libraries included in poi's dependencies, like `React`, `fs-extra`, etc. It is depending on poi's version.

Furthermore, every pieces of code of poi can be imported, among which are poi's API and utility functions.

Poi also defines some global variable or objects to ease the development.

As poi appends its root path to importing paths, so you can import path relative to poi root, for example

```javascript
import { shipsSelector } from 'views/utils/selectors'

// equivalent to
import * as Selectors from 'views/utils/selectors'
const { shipsSelector } = Selectors
```

> Note: due to some historical reasons, ECMAScript module like syntax (`import` and `export`) will be transpiled by `babel`, and the transpile behaviour or result could change in the future
