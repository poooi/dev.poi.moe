---
id: plugin-introduction
title: Introduction to poi and plugins
sidebar_label: Introduction
---

## poi's architecture

This section gives a brief overview of poi's architecture. It might be helpful for you to grasp the idea, but you don't actually need to know all of them to develop a plugin.

poi is built upon [`Electron.js`](https://electronjs.org/). `Electron.js` could be consider as a fusion of `Chromium` browser and `Node.js`. It enables rapid User Interface development like web applications, as well as natively talking with `Node.js` and Operating System API, and using JavaScript throughly.

[`React.js`](https://reactjs.org/) serves as poi's MVVM(Model View ViewModel) framework. It provides pleasant way to write data driven web interface.

poi uses [`Redux`](http://redux.js.org/) for data management. Game data and poi's internal data is put into the Redux store. Then it is connected to `React.js` via [`React-Redux`](https://react-redux.js.org/)

[`Blurprint.js`](https://blueprintjs.com/) is a UI component library for `React.js`. It helps in building poi's user interface.

Besides, poi also benefits from many `Node.js` and browser libraries.

To summerize, following topics are relevant in plugin development. and again, they are not all required in building your plugin. Here's a [learning resource list](guide-resources.md) that could be of help.

- HTML, CSS
- JavaScript (ECMAScript 2017+)
- Node.js as well as [npm](http://npmjs.com/)
- React.js
- Redux as well as React-Redux
- Electron.js

## What is a plugin

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
