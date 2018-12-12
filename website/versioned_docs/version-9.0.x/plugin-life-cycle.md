---
id: version-9.0.x-plugin-life-cycle
title: Life cycle
sidebar_label: Life cycle
original_id: plugin-life-cycle
---

The procedure between the moment plugin is installed, updated, or enabled in settings panel, and the moment it starts to work, is called _enable plugin_. During this procedure, poi will:

1.  import plugin module
1.  read and analyze plugin's `package.json`
1.  load plugin's reducer
1.  call `pluginDidLoad`
1.  update plugin list, load plugin's UI component and mount it

The procedure between the moment plugin is running and and the moment is disabled, is removed or starts being updated, is call _disable plugin_. During this procedure, poi will:

1.  call `pluginWillUnload`
1.  unmount plugin's UI component
1.  update plugin list
1.  remove plugin's reducer and empty plugin store
1.  remove plugin cache such as import cache
