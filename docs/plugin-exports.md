---
id: plugin-exports
title: Exported variables
sidebar_label: Exports
---

Exported variables can de defined in the entry file of a [Node module](https://nodejs.org/api/modules.html), which is the primary way for a module to expose inner functionality and information. If you use [ECMAScript 7's exports statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), the code will be,

```javascript
import {join} from 'path'
export const windowURL = join(__dirname, 'index.html')
```
If you use CoffeeScript, it will be:
```coffeescript
{join} = require 'path'
module.exports.windowURL = join __dirname, 'index.html'
```

Above `_dirname` variable is the root path of your plugin.

poi demands that plugin inform main program with information using exporting.

Panel plugin is essentially a component rendered within main poi. Following variables for panel and backend plugin are:
+ `reactClass`: *React Component*, rendered in main poi as a plugin panel.
+ `reducer`: [*Redux reducer*](http://redux.js.org/docs/basics/Reducers.html), as Redux requires a unique global store, if plugin shall maintain the store, a reducer must be provided and main poi will combine it with its own reducers.
  + plugin store will be placed at `store.ext.<pluginPackageName>`, e.g. `store.ext['poi-plugin-prophet']`. It is recommended to use `extensionSelectorFactory('poi-plugin-prophet')` to retrieve data, as to improve readability.
  + plugin store will be emptied upon being disabled

New window plugin is exactly a new web page window running on another process. Following variables are for new window plugin:

+ `windowURL`: *String*, path for new window plugin's index page.
 + `reactClass` property will be ignored if provided `windowURL`
+ `realClose`: *Boolean*, whether the window is closed on exiting. If set to `true`, "closing the plugin" will just hide the window with plugin running at backend; otherwise closing means empty the process memory. default is `false`
+ `multiWindow`: *Boolean*, whether multiple windows are allowed. If set to `true`, every time clicking the plugin name will open a new window, and `realClose` will be fixed to `true`, otherwise clicking the plugin name will switch to the existing window.
+ `windowOptions`: *Object*, used in window initialization. You are free to use options listed in [Electron BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#class-browserwindow) except for some that are overwritten by poi. Generally you need the following:
 + `x`: *Number*, x coordinate for window
 + `y`: *Number*, y coordinate for window
 + `width`: *Number*, window width
 + `height`: *Number*, window height

And following variables apply to all sorts of plugins:
+ `settingClass`: *React Component*, setting panel for plugin, will be rendered in plugin list, settings view
+ `pluginDidLoad`: *function*, no argument, called after plugin is enabled
+ `pluginWillUnload`: *function*, no argument, called before plugin is disabled

Here's an example using custom reducer. It records and shows the count for clicking a button. Though React state is capable for this task, the code uses Redux for showcasing `export reducer` usage. [JSX language](https://facebook.github.io/react/docs/jsx-in-depth.html) is used.

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Button } from 'react-bootstrap'

// Import selectors defined in poi
import { extensionSelectorFactory } from 'views/utils/selectors'

const EXTENSION_KEY = 'poi-plugin-click-button'

// This selector gets store.ext['poi-plugin-click-button']
const pluginDataSelector = createSelector(
  extensionSelectorFactory(EXTENSION_KEY),
  (state) => state || {}
)
// This selector gets store.ext['poi-plugin-click-button'].count
const clickCountSelector = createSelector(
  pluginDataSelector,
  (state) => state.count
)

// poi will insert this reducer into the root reducer of the app
export function reducer(state={count: 0}, action) {
  const {type} = action
  if (type === '@@poi-plugin-click-button@click')
    return {
      // don't modify the state, use Object Spread Operator
      ...state,
      count: (state.count || 0) + 1,
    }
  return state
}

// Action
function increaseClick() {
  return {
    type: '@@poi-plugin-click-button@click'
  }
}

// poi will render this component in the plugin panel
export const reactClass = connect(
  // mapStateToProps, get store.ext['poi-plugin-click-button'].count and set as this.props.count
  (state, props) => ({count: clickCountSelector(state, props)}),
  // mapDispatchToProps, wrap increaseClick with dispatch and set as this.props.increaseClick
  {
    increaseClick,
  }
)(class PluginClickButton extends Component {
  render() {
    const {count, increaseClick} = this.props
    return (
      <div>
        <h1>Clicked: {count}</h1>
        <Button onClick={increaseClick}>
          Click here!
        </Button>
      </div>
    )
  }
})
```
