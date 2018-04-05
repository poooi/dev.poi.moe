---
id: plugin-exports
title: Exported variables
sidebar_label: Exports
---

Exported variables can de defined in the entry file of a [Node module](https://nodejs.org/api/modules.html), which is the primary way for a module to expose inner functionality and information. If you use [ECMAScript 7's exports statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), the code will be:

```javascript
import { join } from 'path'
export reducer from './reducer' // export from syntax is supported
export const windowURL = join(__dirname, 'index.html') // __dirname is the root path of your plugin.
```

By reading the exported variables, poi could load the plugin and make it work.

A plugin could be totally backend without any UI, and if user interaction is required, the plugin could export a `React.ComponentType` to be rendered within poi's main window or external window. poi will try to import Following variables:

> Note: `React.ComponentType` is a valid component, namely `React.Component`, `React.PureComponent` or `React.StatelessComponent`

* `reactClass`: _React.ComponentType_, rendered in poi's main window or new window.
* `reducer`: [_Redux reducer_](http://redux.js.org/docs/basics/Reducers.html), as Redux requires a unique global store, if plugin shall maintain the store, a reducer must be provided and main poi will combine it with its own reducers.
  * plugin store will be placed at `store.ext.<pluginPackageName>`, e.g. `store.ext['poi-plugin-prophet']`. It is recommended to use `extensionSelectorFactory('poi-plugin-prophet')` to retrieve data, as to improve readability.
  * plugin store will be emptied upon being disabled
* `settingClass`: _React.ComponentType_, setting panel for plugin, will be rendered in plugin list, settings view
* `pluginDidLoad`: _function(): void_, no argument, called after plugin is enabled
* `pluginWillUnload`: _function(): void_, no argument, called before plugin is disabled
* `switchPluginPath`: _Array_, game response URI list for poi to switch to the plugin if the exact game response got, each element could be a single `string` or an object of shape `{ path: string, valid: function(): boolean }`, the `valid` function will be called when the path matches and returns whether poi could switch to the plugin.

Here's an example plugin entry file with a custom reducer. It records and shows the count for clicking a button. Though React state is capable for this task, the code uses Redux for showcasing `export reducer` usage. [JSX syntax](https://facebook.github.io/react/docs/jsx-in-depth.html) is used.

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Button } from 'react-bootstrap'

// Import selectors defined in poi, the path resolution is handled by poi
import { extensionSelectorFactory } from 'views/utils/selectors'

const EXTENSION_KEY = 'poi-plugin-click-button'

// This selector gets store.ext['poi-plugin-click-button']
const pluginDataSelector = createSelector(
  extensionSelectorFactory(EXTENSION_KEY),
  state => state || {},
)
// This selector gets store.ext['poi-plugin-click-button'].count
const clickCountSelector = createSelector(
  pluginDataSelector,
  state => state.count,
)

// poi will insert this reducer into the root reducer of the app
export const reducer = (state = { count: 0 }, action) => {
  const { type } = action
  if (type === '@@poi-plugin-click-button@click')
    return {
      // don't modify the state, use Object Spread Operator
      ...state,
      count: (state.count || 0) + 1,
    }
  return state
}

// Action
const increaseClick = () => ({
  type: '@@poi-plugin-click-button@click',
})

// poi will render this component in the plugin panel
export const reactClass = connect(
  // mapStateToProps, get store.ext['poi-plugin-click-button'].count and set as this.props.count
  (state, props) => ({ count: clickCountSelector(state, props) }),
  // mapDispatchToProps, wrap increaseClick with dispatch and set as this.props.increaseClick
  {
    increaseClick,
  },
)(
  class PluginClickButton extends Component {
    render() {
      const { count, increaseClick } = this.props
      return (
        <div>
          <h1>Clicked: {count}</h1>
          <Button onClick={increaseClick}>Click here!</Button>
        </div>
      )
    }
  },
)
```
