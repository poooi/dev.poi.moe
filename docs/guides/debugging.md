---
id: guide-debugging
title: Debugging a plugin
sidebar_label: Debugging
---

# Debugging a plugin

To load you dev version of plugin in poi, the recommended way is to use [npm link](https://docs.npmjs.com/cli/link).

First run `npm link` in your dev directory (may require admin privilege), and them run `npm link PLUGIN-PACKAGE-NAME` in poi's `APPDATA_PATH`'s plugins sub folder.
