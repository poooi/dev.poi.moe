---
id: api-introduction
title: API introduction
sidebar_label: Introduction
---

Following interfaces are available:

+ HTML DOM API
+ Chrome javascript
+ Node.js standard libraries
+ libraries installed in main poi

For panel and backend plugins, as they are part of main poi, every pieces of code of poi can be imported, they can benefit from poi's APIs, and utility functions.

poi appends its root path to importing paths, so you can import path relative to poi root, e.g.

```javascript
import * from 'views/utils/selectors'
```
equals to

```javascript
import * from `${window.ROOT}/views/utils/selectors`    // Actually syntactically illegal
```
