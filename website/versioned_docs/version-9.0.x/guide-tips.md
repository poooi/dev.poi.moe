---
id: version-9.0.x-guide-tips
title: Tips that might help
sidebar_label: Tips
original_id: guide-tips
---

- plugin that displayed on panel will be wrapped by `<div id='plugin-name' />`, so it is recommended to use `#plugin-name` selector or libraries like `styled-components` or `glamorous` in plugin's stylesheet to avoid touching global styles.
