---
id: plugin-introduction
title: Plugin introduction
sidebar_label: Introduction
---

Poi is based on web, and all UI and procedure are done with web development techniques. Developers
are supposed to have knowledge of following subjects:

* HTML, CSS
* JavaScript（ECMAScript 7）or [CoffeeScript](http://coffeescript.org/) (not recommended)
* [Node.js](https://nodejs.org) as well as [npm](http://npmjs.com/)
* [React.js](http://facebook.github.io/react/)
* [Redux](http://redux.js.org/) as well as [react-redux](https://github.com/reactjs/react-redux)
* [Electron](https://github.com/atom/electron)

Documents of following libraries may be also useful during development:

* [reselect](https://github.com/reactjs/reselect)
* [react-bootstrap](http://react-bootstrap.github.io/components.html)
* [redux-observers](https://github.com/xuoe/redux-observers)

A poi plugin is essentially a node module. Installing, removing or updating the plugin are therefore manupulations on the plugin by poi itself.

A plugin should follow npm related specifications, a [`package.json`](https://docs.npmjs.com/files/package.json) under plugin root directory is necessary. The entry file is specified in `main` field, and, if not provided, will be `index.js`, `index.coffee`, `index.cjsx`, or `index.es`.

Plugin will interact with poi using:

* information provided in `package.json`
* code executed when importing (using `import` or `require` syntax) the module
* imported variables

For example, if a plugin is inside poi main interface (_panel plugin_), a React component should be exported; if it is a standalone window plugin (_window plugin_), it should export content index page (`index.html`); plugins that does not contain any user-interface (_backend plugin_) will just run in the back-end.

Of course there will be many arguments related to installation, upgrade, removing, executing and setting.
