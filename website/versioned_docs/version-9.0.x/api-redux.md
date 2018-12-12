---
id: version-9.0.x-api-redux
title: Utilities with redux
sidebar_label: Redux
original_id: api-redux
---

Poi use `Redux` to store and exchange data. Plugin could make use of `Redux` to avoid manually handling game response.

## Basic usage

Reducers are defined in `views/redux`, store is created in `views/create-store`, and ctions are placed with components.

The best practice to access store data is to use `connect` HOC from `react-redux` together with `Reselect` selectors.

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'

@connect(state => ({
  ships: state.info.ships || {},
}))
class ShipNames extends Component {
  render() {
    const { ships } = this.props
    return (
      <div>
        {map(ships, ship => (
          <div>{ship.api_name}</div>
        ))}
      </div>
    )
  }
}
```

Alternatively, you could access store in following ways

- import global store object, often used with `Redux-observers`
  ```javascript
  import { store } from 'views/create-store'
  ```
- `getStore('a.b.c')`, it can retrieve all data of part of data under certain path. This method is convenient during debugging, but not recommended for prodcution.
  ```javascript
  const { getStore } = window
  getStore('info.$ships.1')
  ```

## Structure

According to [Kancolle API](https://github.com/andanteyk/ElectronicObserver/blob/master/ElectronicObserver/Other/Information/apilist.txt), data including ships, items, maps, etc. comes from 2 sources: one is basic data during game initialization, which is not related to game player; other is player-specific data syncing with server during gaming. For convinient and historical reasons, the former is named with `$` and latter `_`, e.g. `$ships` is for characters(kanmusu) and `_ships` are data of actual ships player owns.

> Note: store data is synced in `localstorage`, if you want to empty store, enter safe mode or manally delete `<APPDATA>/Local Storage` folder after closing poi

Following data paths are related to plugin development:

### `store.const`

Data in this path are all basic information during game initialization, generally *Object*s keyed by `api_id`, same as server packet provided in `/kcsapi/api_start2` .

> These data is also called "master data" in other tools

```javascript
store.const {
  $ships: {
    [key: number]: element in `api_mst_ship`
  }
  $shipTypes: {
    [key: number]: element in `api_mst_stype`
  }
  $equips: {
    [key: number]: element in `api_mst_slotitem`
  }
  $equipTypes: {
    [key: number]: element in `api_mst_slotitem_equiptype`
  }
  $mapareas: {
    [key: number]: element in `api_mst_maparea`
  }
  $maps: {
    [key: number]: element in `api_mst_mapinfo`
  }
  $missions: {
    [key: number]: element in `api_mst_mission`
  }
  $useitems: {
    [key: number]: element in `api_mst_useitem` // items list in アイテム menu
  }
  $shipgraph: {
    [key: number]: element in `api_mst_shipgraph`
  }
}
```

### `store.info`

Data in this path are player data, generally *Object*s keyed by `api_id`, same as server packet

```javascript
store.info {
  basic // player/teitoku basic information, name, id, level, exp, etc.
  ships
  fleets // 0-base, *Array* of lenth 4
  equips
  repairs // 0-base, *Array* of lenth 4
  constructions // 0-base, *Array* of lenth 4
  resources // *Array* of 8 *Number*
  maps
  quests // format {records: <quest progress>, activeQuests: <active quests> }
}
```

### `store.battle`

Data in this path are data related to battle calculated in poi's battle simulation unit `lib-battle`. Poi use this to upodate battle related quest progress. As the game API could change, do not rely on this data.

```javascript
store.battle {
  result
  boss // Boolean
  map // Integer(2-3 => 23)
  enemyHp // Array of Integer
  deckHp // Array of Integer
  deckInitHp // Array of Integer
  enemyShipId // Array of Integer
  deckShipId // Array of Integer
}
```

### `store.sortie`

Data in this path are related to sortie.

```javascript
store.sortie {
  combinedFlag // Integer, api_combined_flag
  sortieStatus // [false|true] * 4, whether a fleet is in sortie or practice
  escapedPos // [] | [idx], array of escaped/towed ships
  // numbers are index of the fleet, starting from 0
  // for combined fleet, it is the index of `fleet1Ships.concat(fleet2Ships)`
}
```

### `store.misc`

Some data that we don't know where to place.

```javascript
store.misc {
  canNotify // will be true the first time log in to HQ screen
}
```

### `store.wctf`

Complementary data from [Who Calls The Fleet](https://fleet.moe) database.

### `store.config`

Poi's config in sync of config file

### `store.ui` and `store.layout`

Display related variables

### `store.plugins`

List of plugins

### `store.ipc`

Whether a Inter-Plugin-Call service is registered

### `store.ext`

Plugins' extended store

## Selectors

[Reselect](https://github.com/reactjs/reselect) provides a way to write `slectors`. A selector is a function to retrive data from its input with a one-time memoize, and multiple selectors could be combined to create new ones.

```javascript
import { createSelector } from 'reselect'
import { mapValues } from 'lodash'

// simple selectors reading store data
const shipsSelector = state => state.info.ships
const $shipsSelector = state => state.const.$ships

shipSelector(window.getStore()) // `window.getStore` returns store data, and this will return data of store's info.ships

// new selector in combination of selectors above
const shipsDataSelector = createSelector(
  [
    shipsSelector,
    $shipsSelector,
  ], (ships, $ships) => mapValues(ships, ship => ({
    ...($ships[ship.api_id] || {}),
    ...ship,
  }))
)

// selectorFactory is a function to create selector, you could use memoize to ensure the same selector is used
const kanmusuDataSelectorFactory = id => createSelector(
  [
    shipsDataSelector,
  ], (shipsData) => shipsData[id]
)

// usage in `connect`
@connect(
  state => ({
    shipsData: shipsDataSelector(state),
    myInitialKanmusuData: kanmusuDataSelectorFactory(1)(state),
  })
)
```

> Note: one-time memoize means if the input data is not changed (compared by `===`), the returned value will not change, in this way, unnecessary computations and also react component updates are prevented.

It is highly recommended to use selectors in accessing store data.

`'views/utils/selectos'` provides some commonly used slectors for game data. Here lists some examples.

- `fleetSelectorFactory(fleetId)`: returns selector of `store.info.fleets[<fleetId>]` when called with `fleetId`(from 0 to 3)
- `shipDataSelectorFactory(shipId)`: returns selector of data of certain ship when called with `shipId`. Which will be in format `[_ship, $ship]` or `undefined` if shipId dose not exist.
- `fleetShipDataSelectorFactory(fleetId)`: returns selector of all ships in the given fleet. in format `[_ship, $ship]` or `undefined` if fleetId dose not exist

Besides, some special selectors are:

- `stateSelector`: returns whole store. Used only when composing new selector, for example, `fleetShipsDataSelectorFactory`.
- `extensionSelectorFactory(extKey)`: returns `store.ext[<extKey>]`. When a plugin exports `reducer` calling it with `extKey` will return store for the reducer.

And also helper function:

- `createDeepCompareArraySelector`: similar to `createSelector` but will strict equality compare(`===`) on every element of array. If every element is strictly equal, they will be consider equal. This can be used in slectors with many elements composing arrays.

Pay attention that **slectors are not generally safe**, developers are supposed to handle exceptions on their own, especially considering the case of freshly installed poi and not logged in (the store is nearly empty).

## Redux actions

If you consider maintaining reducers, you may need some Redux actions dispatched by main poi:

- `@@Request/kcsapi/<api>`, such as `@@Request/kcsapi/api_port/port` , dispatched before game request is to be sent, in format

```javascript
{
  type // `@@Request/kcsapi/<api>`
  method // 'GET' | 'POST' | ...
  path // `/kcsapi/<api>`
  body // Request body
}
```

- `@@Response/kcsapi/<api>`, such as `@@Response/kcsapi/api_port/port`, dispatched after response is received, in format

```javascript
{
  type // `@@Response/kcsapi/<api>`
  method // 'GET' | 'POST' | ...
  path // `/kcsapi/<api>`
  body // Response body
  postBody // Request body
}
```

- `@@BattleResult`, dispatched after a battle ends. If you need battle result, please use this action instead of listening to `@@Response/kcsapi/api_req_sortie/battleresult`. It is because the battle processing and storage is in the latter action, and the disordered reducer may cause error. it is in format

```javascript
{
  type: '@@BattleResult',
  result:
    valid              // always true
    rank               // *String*, 'S' | ... | 'D'
    boss               // *Boolean*
    map                // *Number*, 11 | ... | 54 | ...
    mapCell            // *Number*, same as api_no in api_req_map/next, it is actually route number not cell number
    quest              // *String*, map name
    enemy              // *String*, enemy fleet name
    combined           // *Boolean*
    mvp                // *Array*,  single fleet: [<mvp>, <mvp>] combined fleet: [<mvpFlee1>, <mvpFleet2>], format is 1 | ... | 6 | -1 (none)
    dropItem           // *Object*, see api_get_useitem
    dropShipId         // *Number*, drop ship's api_id
    deckShipId         // *Array*, ships' api_id, concated when combined fleet
    deckHp             // *Array*, HP at battle's end, concated when combined fleet
    deckInitHp         // *Array*, HP at battle's start, concated when combined fleet
    enemyShipId        // *Array*, enemy ships' api_ship_id
    enemyFormation     // *Number*, same as api_formation
    enemyHp            // *Array*, HP at battle's end
    eventItem          // *Object* | null, same as api_get_eventitem
    time               // *Number* Start time of the battle
}
```

## Asynchronous Actions

Redux reducers must be pure, all operations introducing side effects will slow the execution and cause performance issues. They should be prepared in or before actions.

poi intergrates [`redux-thunk`](https://github.com/gaearon/redux-thunk) for asynchronous manupulations. Besides dispatching a plain object, you may dispatch a function of type `function(dispatch, getState): any`, in which you may asynchronously work with data and dispatch actions.

In the following example, the component will load data from file upon being mounted. Data reading operation is async, thus it could not be placed within reducers. In the thunk it will first dispatch a loading action to indicate the store is loading data, and after file is read, it will compare the store and file to dispatch an update action. Code in `catch` and `finally` blocks are another 2 actions for update the reading status.

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { readJson } from 'fs-extra'
import path from 'path'
import { isEqual } from 'lodash'

const { APPDATA_PATH } = window
const DATA_PATH = path.join(APPDATA_PATH, 'poi-plugin-chiba.json')

const readDataAction = () => async (dispatch, getState) => {
  dispatch({
    type: '@@poi-plugin-chiba@loading',
    data,
  })
  try {
    const data = await readJson(DATA_PATH)

    const state = getState()

    if (!isEqual(data, state)) {
      dispatch({
        type: '@@poi-plugin-chiba@update',
        data,
      })
    }
  } catch (e) {
    dispatch({
      type: '@@poi-plugin-chiba@error',
    })
  } finally {
    dispatch({
      type: '@@poi-plugin-chiba@ready',
    })
  }
}

// usage in react component
@connect()
class Chiba extends Component {
  componentDidMount = () => {
    this.props.dispatch(readDataAction())
  }
}
```

## Observers

[`redux-observers`](https://github.com/xuoe/redux-observers) is used to monitor certain path of store and reacts when it changes. The manupulation may be just store the data or compute with some functions, or even dispatch a new action. You can refer to its documents for more details.

It should be note that if you define an observer in your plugin, it should be removed when plugin is disabled with the returned `unsubscribeFunc` from your call of `observe`.

Example:

```javascript
// index.es
import { observe, observer } from 'redux-observers'
import { createSelector } from 'reselect'
import { writeFileSync } from 'fs'

import { extensionSelectorFactory } from 'views/utils/selectors'
import { store } from 'views/create-store'

const EXTENSION_KEY = 'poi-plugin-some-plugin-name'

const countSelector = createSelector(
  extensionSelectorFactory(EXTENSION_KEY),
  state => state.count,
)

const unsubscribeObserve = observe(store, [
  observer(
    state => countSelector(state),
    (dispatch, current, previous) => {
      writeFileSync('someFile.json', JSON.stringify({ count: current }))
    },
  ),
])

export function pluginWillUnload() {
  unsubscribeObserve()
}
```
