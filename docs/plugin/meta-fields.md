---
id: plugin-meta-fields
title: Meta fields in package.json
sidebar_label: Meta fields
---

# Meta fields in package.json

`package.json` is the standard file for npm module metadata, its structure can be refered in [npm offical documents](https://docs.npmjs.com/files/package.json). poi makes use of parts of its standard field, and also extra field for plugin's own information.

Standard metadata used are:

- `version`: _String_, plugin version in [Semantic Versioning](http://semver.org/) format, e.g. `x.y.z` for stable version, `x.y.z-beta.a` for beta version.
- `author`: author for plugin
  - if _String_, it is the name of author
  - if _Object_, then `name` is the name of author,`links` or `url` is the links to the author.
- `description`: _String_, brief description

Extra information is stored in `poiPlugin` field, including:

- `title`: _String_, title for plugin, displayed in plugin list and menu. Will be translated if it exists in i18n resources.
- `id`: _String_, key for identify the plugin. Will fallback to package name if empty.
- `priority`: _Number_, priority in plugin menu, smaller value will move it forward. Generally the order is panel plugin < window plugin < back end plugin, but it is not obliged.
- `description`: _String_, description of the plugin, displayed in plugin list. Since standard metadata's `description` is displayed in npm website, this field is for poi specified description. Will be translated if it exists in i18n resources.
- `icon`: _String_, icon for plugin in plugin list, supports icons names `FontAwesome` version 4
- `i18nDir`: _String_, custom i18n path relative to plugin root, defaults to `./i18n` and `./assets/i18n`.
- `apiVer`, _Object_, defines plugin compatibility. Use it if a newer version is not compatible on older poi versions. Poi will check the field for installed plugin to determine its loading, and also check the field in latest version on npm repository, to control the update check, installation, upgrade or rolling back. Its format will be:
  ```json
  {
    <poiVer>: <pluginVer>,
  }
  ```
  which means: plugins versioned above `pluginVer` requires poi version above `poiVer`; if poi version is under `poiVer`, will rollback to `pluginVer`.
  - For example, if a plugin's version `1.2.0` is only compatible to poi version `9.2.0` and above, and the latest version available to poi version below `9.2.0` is `1.1.12`, then the entry will be:
    ```json
    {
      "9.2.0": "1.1.12"
    }
    ```
  - Attention, `pluginVer` should exactly exist in npm repository since the rolling back will use the exact version, while `poiVer` is not limited, e.g. you can use `6.99.99` to cover poi versions under 7.0.0
  - poi will check update information in npm registry and rollback to the most latest stable version if possible.

An example `package.json`:

```json
{
  "name": "poi-plugin-translator",
  "version": "0.2.4",
  "main": "index.js",
  "description": "A plugin for poi that translates names.",
  "author": {
    "name": "KochiyaOcean",
    "url": "https://github.com/kochiyaocean"
  },
  "poiPlugin": {
    "title": "Translator",
    "description": "Translate ships' & equipments' name into English",
    "icon": "fa/language",
    "i18nDir": "i18n/translator",
    "apiVer": {
      "6.3.3": "2.1.1",
      "7.0.0-beta.1": "3.0.0"
    }
  }
}
```
