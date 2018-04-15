---
id: api-poi-utils
title: Utilities in poi
sidebar_label: Utilities
---

## Global constants

| Name         |   Type   | Description                                                                                                                               |
| ------------ | :------: | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ROOT         | `string` | poi's root path, namely path where package.json and index.html reside                                                                     |
| APPDATA_PATH | `string` | path to store user data <br/> `%AppData%/poi` (Windows), <br/> `~/.config/poi` (Linux), <br/> `~/Library/Application Support/poi` (macOS) |
| POI_VERSION  | `string` | poi version                                                                                                                               |

Although we have some globals such as `ships`, `$ships`, `slotitems` and `$slotitems` to ease devtool interactive debugging. It is not recommended to use them in the plugin because they cannot be reactive to changes. You're supposed to get these data via `Redux`.

> Note: some globals are actually `Proxy`, directly using them may cause hidden problems. for example:
>
> ```javascript
> const { ships } = window // ships will not get updated! It remains the same data as when it is declared
> ```

There're also some global functions defined in `window`, they're for compatibility reason or for easing devtool debugging. They should be `import` to your code.

## Environment for window mode

In window mode, the plugin component is mounted by window opened by `window.open` method using [portals](https://reactjs.org/docs/portals.html), so you can't access environment of new window directly by calling `window` object (It is `window` object of main window).

The environment of new window can be accessed by [context](https://reactjs.org/docs/context.html).

```javascript
import React from 'react'
import { WindowEnv } from 'views/components/etc/window-env'

// window: window object of window that plugin belongs to.
// mountpoint: container that mounts plugin and overlays(tooltip, modal, etc).
export const reactClass = () => (
  <WindowEnv.Consumer>
    {({ window, mountPoint }) => <div>{window.document.title}</div>}
  </WindowEnv.Consumer>
)
```

## Notifications

Poi supports various notifications:

### Info bar

To display information in the info bar under game area:

```javascript
window.log('Something') // display on the information bar below game window
window.warn('Something') // display on the information bar below game window
window.error('Something') // display on the information bar below game window
window.success('Something') // display on the information bar below game window
```

### Desktop

To use desktop noftication, check `views/env-parts/notif-center.es#L42` for more detail:

```javascript
window.notify('Something') // desktop notification
```

### Modal

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

### Toast

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

If you want to use config within React component, instead of `config.get`, the best practice is to use selectors (see `views/utils/selectors`) to retrieve from store.config, with `lodash`'s `get` method or optional chaining operator.

## Inter-Plugin Call

> Note: this is not electron's IPC(Inter-Process-Call)

Inter-Plugin Call is created to enable communications among plugins. Apart from IPC, You can also share data via `Redux`.

### Registering plugin's API:

You should use a unique string, say, plugin name as IPC scope to avoid conflicts.

```javascript
const { ipc } = window

ipc.register("scope_name", {
  api_name:   @ref_to_function
  api_name2:  @ref_to_function_2
});
```

### Unregistering

```javascript
const { ipc } = window

ipc.unregister('scope', 'api_name');
ipc.unregister('scope', ['api', 'api2']);
ipc.unregister('scope', {
  api:   @whatever
  api2:  @whatever
});
ipc.unregisterAll('scope');
```

### Calling other plugin's API:

NOTICE: All calls are asynchronous. A return value could not be expected.

```javascript
scope = ipc.access('scope')
scope?.api_name?(args) // you should check the existence before calling to avoid exceptions
```

A plugin's ipc existence is also in `Redux` store

### Calling an API of all plugins：

```javascript
ipc.foreachCall('api', arg1, arg2, ...)
```

## i18n

Poi supports i18n with `i18next` package.

Place your translation files in the path indicated by `poiPlugin.i18nDir` of `package.json`

You can import the i18next object from `views/env-parts/i18next` and use it to start translation.

```javascript
import i18next from 'views/env-parts/i18next'

i18next.t('Yori Dori Midori Poi~')

const fiexdT = i18next.getFixedT('en-US', 'main')

fixedT('poi poi poi')
```

`react-i18next` is preferable used within your React components.

```javascript
import React, { Component } from 'react'
import { translate } from 'react-i18next'

@translate()
class PoiContent extends Component {
  render() {
    const { t } = this.props

    return <div>{t('poi is awesome')}</div>
  }
}
```

more usage could be found in [react-i18next's officail docs](https://react.i18next.com/).
