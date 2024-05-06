---
id: plugin-introduction
title: Introduction to poi and plugins
sidebar_label: Introduction
---

# Introduction to poi and plugins

## poi's architecture

This section gives a brief overview of poi's architecture. It might be helpful for you to grasp the idea, but you don't actually need to know all of them to develop a plugin.

poi is built upon [`Electron.js`](https://electronjs.org/). `Electron.js` could be consider as a fusion of `Chromium` browser and `Node.js`. It enables rapid User Interface development like web applications, as well as natively talking with `Node.js` and Operating System API, and using JavaScript throughly.

[`React.js`](https://reactjs.org/) serves as poi's MVVM(Model View ViewModel) framework. It provides pleasant way to write data driven web interface.

poi uses [`Redux`](http://redux.js.org/) for data management. Game data and poi's internal data is put into the Redux store. Then it is connected to `React.js` via [`React-Redux`](https://react-redux.js.org/)

[`Blurprint.js`](https://blueprintjs.com/) is a UI component library for `React.js`. It helps in building poi's user interface.

Besides, poi also benefits from many `Node.js` and browser libraries.

To summerize, following topics are relevant in plugin development. and again, they are not all required in building your plugin.

- HTML, CSS
- JavaScript (ECMAScript 2017+)
- Node.js as well as [npm](http://npmjs.com/)
- React.js
- Redux as well as React-Redux
- Electron.js

## Plugin

A poi plugin is essentially a piece of JavaScript code that interacts with poi. For better management and redistribution, it is wrapped in a [`Node.js module`](https://nodejs.org/api/modules.html#modules_modules), and finally form a [`npm package`](https://docs.npmjs.com/about-packages-and-modules). poi bundles its own `npm` executable for downloading, installing and removing plugins.

To make a plugin valid npm package, a [`package.json`](https://docs.npmjs.com/files/package.json) under plugin root directory is necessary. The entry file is specified in `main` field, nad if not provided, poi will try possible common entry file names, e.g. `index.js` or `index.es`.

poi reads `package.json` file, then load plugin package to discover predefined variables. According to the information of the plugin, poi launches corresponding tasks to make plugin work.

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

In brief, building a plugin is to:

- write JavaScript code implementing your desired functionalities
- prepare variables to export in entry file
- form a valid npm package
- publish the package so that it could be publicly accessed

Since
