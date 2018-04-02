---
id: api-redux
title: Utilities with redux
sidebar_label: Redux
---

## Redux store
poi uses Redux store for data including game information.

Reducers are defined in `views/redux`, and store is created in `views/create-store`. Following interfaces are available, the best practice, however, is to use selector, reducer as well as `connect` from `react-redux`.
+ `import { store } from 'views/create-store'`: global store
+ `import { extendReducer } from 'views/create-store'`: `extendReducer(key, reducer)` will add `reducer` under `store.ext.<key>`
+ `const { getStore } = window`: `getStore()` or `getStore('a.b.c')` can retrieve all data of part of data under certain path. This method is convenient during debugging, but not recommended for prodcution. If you use it in reducer, it implies a better design for store is needed to assure the independency; if you use it in React component, you may use `connect` instead. Anyway, you have to live with it sometimes.


## Naming
According to [Kancolle API](https://github.com/andanteyk/ElectronicObserver/blob/master/ElectronicObserver/Other/Information/apilist.txt), data including ships, items, maps, etc. comes from 2 sources: one is basic data during game initialization, which is not related to game player; other is player data that is given and kept updated during gaming. For convinient and historical reasons, the former is named with `$` and latter `_`, e.g. `$ships` and `_ships`.

Following data paths are related to plugin development:

### store.const
Data in this path are all basic information during game initialization, generally *Object*s keyed by `api_id`, same as server packet.
```javascript
store.const.
  $ships
  $shipTypes
  $equips
  $equipTypes
  $mapareas
  $maps
  $missions
  $useitems     // items list in アイテム menu
  $shipgraph
```

### store.info
Data in this path are player data, generally *Object*s keyed by `api_id`, same as server packet
```javascript
store.info.
  basic         // player/teitoku basic information, name, id, level, exp, etc.
  ships
  fleets        // 0-base, *Array* of lenth 4
  equips
  repairs       // 0-base, *Array* of lenth 4
  constructions // 0-base, *Array* of lenth 4
  resources     // *Array* of 8 *Number*
  maps
  quests        // format {records: <quest progress>, activeQuests: <active quests> }
```

### store.battle
Data in this path are data related to battle.
```javascript
store.battle.
  result.
    rank        // String
    boss        // Boolean
    map         // Integer(2-3 => 23)
    enemyHp     // Array of Integer
    deckHp      // Array of Integer
    deckInitHp  // Array of Integer
    enemyShipId // Array of Integer
    deckShipId  // Array of Integer
```

### store.sortie
Data in this path are related to sortie.
```javascript
store.sortie.
  combinedFlag      // Integer, api_combined_flag
  sortieStatus      // [false|true] * 4, whether a fleet is in sortie
  escapedPos        // [] | [idx], array of escaped/towed ships
    // 0 for fleet1Pos1, 6 for fleet2Pos1, ..., 23 for fleet4Pos6
```

### store.misc
Some data that we don't know where to place.
```javascript
store.misc.
  canNotify         // will be true the first time log in to HQ screen
```

## Selectors
When convenient, use [reselect](https://github.com/reactjs/reselect)'s selector to obtain data from store to avoid unnecessary compuations and renderings.

`'views/utils/selectos'` provides some commonly used slectors for game data. Here lists some example.
+ `fleetSelectorFactory(fleetId)`: returns selector of `store.info.fleets[<fleetId>]` when called with `fleetId`(from 0 to 3)
+ `shipDataSelectorFactory(shipId)`: returns selector of data of certain ship when called with `shipId`. Which will be in format `[_ship, $ship]` or `undefined` if shipId dose not exist.
+ `fleetShipDataSelectorFactory(fleetId)`: returns selector of all ships in the given fleet. in format `[_ship, $ship]` or `undefined` if fleetId dose not exist

Besides, some special selectors are:
+ `stateSelector`: returns whole store. Used only when composing new selector, for example, `fleetShipsDataSelectorFactory`.
+ `extensionSelectorFactory(extKey)`: returns `store.ext[<extKey>]`. When a plugin exports `reducer` calling it with `extKey` will return store for the reducer.

And also helper function:
+ `createDeepCompareArraySelector`: similar to `createSelector` but will  strict equality compare(`===`) on every element of array. If every element is strictly equal, they will be consider equal. This can be used in slectors with many elements composing arrays.

Pay attention that __slectors are not generally safe__, developers are supposed to handle exceptions on their own, especially considering the case of freshly installed poi and not logged in (the store is nearly empty).

## Redux action
If you consider maintaining reducers, you may need some Redux actions dispatched by main poi:
+ `@@Request/kcsapi/<api>`, such as `@@Request/kcsapi/api_port/port` , dispatched before game request is to be sent, in format
```javascript
  action.
    type        // `@@Request/kcsapi/<api>`
    method      // 'GET' | 'POST' | ...
    path        // `/kcsapi/<api>`
    body        // Request body
```
+ `@@Response/kcsapi/<api>`, such as `@@Response/kcsapi/api_port/port`, dispatched after response is received, in format
```javascript
  action.
    type        // `@@Response/kcsapi/<api>`
    method      // 'GET' | 'POST' | ...
    path        // `/kcsapi/<api>`
    body        // Response body
    postBody    // Request body
```
+ `@@BattleResult`, dispatched after a battle ends. If you need battle result, please use this action instead of listening to `@@Response/kcsapi/api_req_sortie/battleresult`. It is because the battle processing and storage is in the latter action, and the disordered reducer may cause error. it is in format
```javascript
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
```

## Promise Action
poi intergrates [`redux-thunk`](https://github.com/gaearon/redux-thunk) for asynchronous manupulations. Besides dispatching a plain object, you may dispatch a function with argument `(dispatch, getState) => {}`, in which you may asynchronously work with data and dispatch actions.

You may also use poi's `PromiseAction` API for dispatching promise. The arguments are:
+ `actionNameBase`: *String*
+ `promiseGenerator`: *function* with no argument, returning a promise
+ `args`：anything, optional, will be passed to promiseGenerator and each action

dispatching an instance of the class will generate 3 actions:
```javascript
   // dispathed before running promiseGenerator
   {
     type: `${actionNameBase}`,
     args,
   }
   // dispatched after promise resolve
   {
     type: `${actionNameBase}@then`,
     result: <result>,
     args,
   }
   // dispatch after promise on error
   {
     type: `${actionNameBase}@catch`,
     error: <error>
     args,
   }
```

An example:
```javascript
import { PromiseAction } from 'views/middlewares/promise-action'
import { readFile } from 'fs'

function readSomeFile(filename) {
  return new PromiseAction('@@TestAction/Readfile',     // action name base
    ({filename}) =>                 // A function that returns a promise
      readFile(filename),
    {                                                   // Optional args
      filename: filename,
      time: Date.now()
    }
  )
}



store.dispatch(readSomeFile('./assets/useful-file.json')


function reducer(state, action) {
  const {type, error, result, args} = action
  switch (type) {
  case '@@TestAction/Readfile':
    console.log(`About to read file ${args.filename} now!`)
    break
  case '@@TestAction/Readfile@then':
    console.log(`Successfully read file ${args.filename} at ${args.time}!`)
    console.log(`The file reads:`)
    console.log(result)
    return {
      ...state,
      ...result,
    }
  case '@@TestAction/Readfile@catch':
    console.log(`Failed to read file ${args.filename} at ${args.time}!`)
    console.log(error.stack)
    break
  }
}

```

## Observer
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
  (state) => state.count
)

const unsubscribeObserve = observe(store, [
  observer(
    state => countSelector(state),
    (dispatch, current, previous) => {
      writeFileSync('someFile.json', JSON.stringify({count: current}))
    }
  )]
)

export function pluginWillUnload() {
  unsubscribeObserve()
}
```
