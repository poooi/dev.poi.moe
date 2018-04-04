---
id: api-poi-utils
title: Utilities in poi
sidebar_label: Utilities
---

## Globals

```javascript
window = ROOT // poi's root path, namely path where package.json and index.html reside
APPDATA_PATH // path to store user data, it will be %AppData%/poi on Windows, ~/.config/poi on Linux, ~/Library/Application Support/poi on macOS
POI_VERSION // poi version
```

some globals are reserved for compatibility, such as `_`, `ships`. It is not recommended to use them in the plugin. Use `import` or `store`'s `selector` instead.

## Notifications

To display information in the info bar under game area:

```javascript
window.log('Something') // display on the information bar below game window
window.warn('Something') // display on the information bar below game window
window.error('Something') // display on the information bar below game window
window.success('Something') // display on the information bar below game window
```

To use desktop noftication, check `views/env-parts/notif-center.es#L42` for more detail:

```javascript
window.notify('Something') // desktop notification
```

To use modal:

```javascript
window.toggleModal('Title', 'Content') // display modal, Content can be HTML
// if you need to customize buttons
var footer = [
  {
    name: String, // button display name
    func: Function, // action on clicking the button
    style:
      String in ['default', 'primary', 'success', 'info', 'danger', 'warning'], // button style
  },
]
window.toggleModal('Title', 'Content', footer)
```

To use toast, check `views/env-parts/toast.es#L2` for more detail:

```javascript
window.toast('something')
```

## Config API

Global `window.config` class handles configurations. The config is saved in `config.cson` that resides in `APPDATA_PATH`, and also loaded in `store.config`.

```javascript
window.config.get('path.to.config', 'default') // get a user config value, if fail, return the default value (NOT RECOMMENDED, SEE BELOW)
window.config.set('path.to.config', 'some value') // save a user config value, not providing value will delete the config path
window.layout // current layout = 'horizontal' || 'vertical'
window.theme // current theme
```

If you want to use config within React component, instead of `config.get`, the best practice is to use selectors (see `views/utils/selectors`) to retrieve from store.config, with `lodash`'s `get` method.

## Theming

You may use theme API from main poi to let your window plugin use the same theme.

```javascript
require(`${ROOT}/views/env-parts/theme`) // if you've loaded ROOT variable
```

The API will load stylesheets for `bootstrap`, `font-awesome`, and user defined `custom.css`, you may append following `<link>` tags into your `<head>`.

```html
<link rel="stylesheet" id="bootstrap-css">
<link rel="stylesheet" id="fontawesome-css">
<link rel="stylesheet" id="custom-css">
```

The zooming factor in main poi is not inherit, so you have to deal with it yourself, for example, zooming the font size only to get rid of window size issues.

```javascript
const zoomLevel = config.get('poi.zoomLevel', 1)
const additionalStyle = document.createElement('style')

remote.getCurrentWindow().webContents.on('dom-ready', e => {
  document.body.appendChild(additionalStyle)
})

additionalStyle.innerHTML = `
  item-improvement {
    font-size: ${zoomLevel * 100}%;
  }
`
```

## Inter-Plugin Call

Import IPC module

```javascript
var ipc = window.ipc
```

Register plugin's API:
You should use `pluginName` as `scope_name`.

```javascript
ipc.register("scope_name", {
  api_name:   @ref_to_function
  api_name2:  @ref_to_function_2
});
```

Unregister plugin's API:

```javascript
ipc.unregister("scope_name", "api_name");
ipc.unregister("scope_name", ["api_name", "api_name2"]);
ipc.unregister("scope_name", {
  api_name:   @whatever
  api_name2:  @whatever
});
ipc.unregisterAll("scope_name");
```

Call other plugin's API:
NOTICE: All calls are asynchronous. You mustn't expect a return value.

```coffeescript
scope = ipc.access("scope_name");
scope?.api_name?(args);
```

Call an API of all plugins：

```javascript
ipc.foreachCall("api_name", arg1, arg2, ...)
```

## i18n

Poi supports i18n with `i18n-2` package.

Place your translation files in the path indicated by `poiPlugin.i18nDir` of `package.json`, and the translation object `window.i18n[plugin id]` will be automatically created.

For panel plugin, use `translated = window.i18n[plugin id].__(toTranslate)` to get string translated.

`poi-plugin-translator` provides English / Korean localization for ship and item names, etc.

For i18n of game resources, poi predefines a translation method, for non-window plugin, it can be called as below:

```javascript
resource = window.i18n.resources.__('to translate')
```

For window plugin, you have to create yourself translation object.

```javascript
window.language = config.get('poi.language', navigator.language)
const i18n = new i18n2({
  locales: ['en-US', 'ja-JP', 'zh-CN', 'zh-TW'],
  defaultLocale: 'zh-CN',
  directory: join(__dirname, 'i18n'),
  extension: '.json',
  updateFiles: false,
  devMode: false,
})
i18n.setLocale(window.language)

if (i18n.resources == null) {
  i18n.resources = {}
}

if (i18n.resources.__ == null) {
  i18n.resources.__ = str => str
}
if (i18n.resources.translate == null) {
  i18n.resources.translate = (locale, str) => str
}
if (i18n.resources.setLocale == null) {
  i18n.resources.setLocale = str => {}
}

window.i18n = i18n

try {
  require('poi-plugin-translator').pluginDidLoad()
} catch (error) {
  console.warn('plugin-translator', error)
}

window.__ = i18n.__.bind(i18n)
window.__r = i18n.resources.__.bind(i18n.resources)

window.i18n = i18n

resource = window.i18n.resources.__('to translate')
```

It is recommended to translate the window title

```javascript
document.title = window.__('your-plugin')
```

Please refer to [i18n-2](https://github.com/jeresig/i18n-node-2) for more information on i18n-2 package.
