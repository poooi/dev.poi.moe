---
id: plugin-life-cycle
title: Life cycle
sidebar_label: Life cycle
---

The procedure between the moment plugin is installed, updated, or enabled in settings panel, and the moment it starts to work, is called _enable plugin_. During this procedure, poi will:

1.  import plugin module
1.  read and analyze plugin's `package.json`
1.  load plugin's reducer
1.  call `pluginDidLoad`
1.  update plugin list, load plugin component or window

The procedure between the moment plugin is running and and the moment is disabled, is removed or starts being updated, is call _disable plugin_. During this procedure, poi will:

1.  call `pluginWillUnload`
1.  close the window for window plugin
1.  update plugin list
1.  remove plugin's reducer and empty plugin store
1.  remove plugin cache such as import cache
