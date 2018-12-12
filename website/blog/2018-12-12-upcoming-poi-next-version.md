---
title: poi's next version is coming
author: かがみ
---

After almost 3-month development, poi's next big version is about to release. This biggest thing is that we switched the UI library from `React-Boostrap` to `Blureprint.js`, which greatly improves user experience. We also took advantage of this change to land some new technologies, including `Styled-Components` CSS-in-JS solution, TypeScript support through `Babel` and `prettier` code formatting. And we also saw some deprecations either on poi's side or on our dependencies' side.

In this article I would like to make an overview of these changes concerning plugin development.

## blueprint.js

### Why

`React-Bootstrap` is of good quality in terms of code, design and principles, and it was used in poi for years. It's next major version, however, migrates `Bootstrap` bindings from 3 to 4 and making a large amount of breaking changes which could not be automatically handled. Meanwhile we're feeling lack of advanced and complexe components in this library. Since such a breaking change is inevitable, we decided to try something new.

`Blueprint.js` offers a more complete component set than that of `React-Bootstrap`. And as it is natively written in TypeScript, it can be easily used in both JavaScript and TypeScript projects, and provide friendly code hints with Visual Studio Code. After comparing with other popular React.js component libraries, we believe it is a valid choice.

### Migration for plugins

We're not dropping `React-Bootstrap` soon. But it is strongly recommended that developers have a try for `Blueprint.js` and start working on migration sooner or later. The main poi's usage could be a good reference, and we'll document possible pitfalls and instructions.

## Styled-Components

`Styled-Components` is introduced to make style sheets closer to their components with flexible variations. You can start use it today.

poi still provides ordinary and stable class names for css customization.

## Typescript

`Babel` 7 ships a good TypeScript support, making it possible to try this JavaScript superset (with some limitations though) along with poi's existing code. We're still exploring possibilities in poi development usage. A reference plugin might be available in the future.
