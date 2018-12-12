---
id: version-9.0.x-plugin-introduction
title: Plugin introduction
sidebar_label: Introduction
original_id: plugin-introduction
---

Poi is based on web, and all UI and procedure are done with web development techniques. Developers
are supposed to have knowledge of following subjects:

- HTML, CSS
- JavaScript (ECMAScript 2017+)
- [Node.js](https://nodejs.org) as well as [npm](http://npmjs.com/)
- [React.js](http://reactjs.io/)
- [Redux](http://redux.js.org/) as well as [react-redux](https://redux.js.org/basics/usage-with-react)
- [Electron](https://github.com/electron/electron)

Documents of following libraries may be also useful during development:

- [reselect](https://github.com/reactjs/reselect)
- [react-bootstrap](https://react-bootstrap.github.io/)
- [redux-observers](https://github.com/xuoe/redux-observers)
- and many other libraies listed in poi's dependencies

A poi plugin is essentially a node module. Installing, removing or updating the plugin in fact correspond to npm manupluations under the same name, which are managed by poi itself.

A plugin should follow npm related specifications, a [`package.json`](https://docs.npmjs.com/files/package.json) under plugin root directory is necessary. The entry file is specified in `main` field, and, if not provided, will be `index.js`, or `index.es`.

Plugin will interact with poi using:

- information provided in `package.json`
- code blocks exported from the module and imported by poi via `import` or `require` syntax
- exported variables

A typical folder structure of poi plugin could be:

```
poi-plugin-foo-bar
├── assets
│   └── // images, stylesheets, etc
├── i18n
│   └── // i18n translation files
├── index.es // main entry point
├── lib
│   └── // 3rd party lib
├── LICENSE.md
├── package.json // npm package meta data file
├── README.md
├── redux
│   └── // redux related, e.g. reducers, actions, selectors,
└── views
    └── // your react components
```
