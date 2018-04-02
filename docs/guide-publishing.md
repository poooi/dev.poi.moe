---
id: guide-publishing
title: Publishing a plugin
sidebar_label: Publishing
---

## Publishing on [npm](http://npmjs.org)

Publishing on npm facilitates versioning, and poi will use reloaded npm module to update plugin to new version.

For more info, you can read npm's docs:  [package.json](https://docs.npmjs.com/files/package.json) and [npm publish](https://docs.npmjs.com/cli/publish).

Package name should begin with `poi-plugin-` to make it detected by poi.

## Publishing a beta version

It is possible to publish a beta version on npm for beta testers and early access users。Plugin's beta version number should be something like `x.y.z-beta.a`, say, `"version": "2.2.0-beta.0"`. When publishing on npm, use `beta` tag instead of `latest` tag.

Correspondingly, stable version number should be in `x.y.z` format, following [Semantic Versioning](http://semver.org/).

Example command is:

`npm publish --tag beta`

## Publishing plugin as installable archive

Installable archive should be packaged in tar.gz format for users who want to download and install offline.

Example command is:

```
cd path/to/[repo] && npm i
cd .. && tar cvf [repo] [repo].tar.gz
```
