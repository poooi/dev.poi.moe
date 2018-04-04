---
id: api-events
title: Events
sidebar_label: Events
---

poi use a few global events for communication. Since overusing events will break program's hierarchy and complexifies the procedures, avoid events if possible.

Corresponding to `@@Request/kcsapi/<api>` and `@@Response/kcsapi/<api>`, 2 events are emitted before sending request and after receiving responses, they are:

```javascript
window.addEventListener('game.request', function(e) {
  e.detail.method // HTTP method (POST / GET)
  e.detail.path // API path
  e.detail.body // data to send
})
window.addEventListener('game.response', function(e) {
  e.detail.method // HTTP method (POST / GET)
  e.detail.path // API path
  e.detail.body // returned data
  e.detail.postBody // data sended
})
```

Normally you don't have to listen to these events, especially when you have react component. You should write reducers and listen to redux actions for data maintenance. If you use events, React will have to re-render 2 times, one after action and one after event, which increases the cost and should be avoid. You should not use these events for data storage, either. Use observer for monitoring store instead.

There do exist cases when you may use them. For backend service, listening to events won't change panel data, but only manupulations like storaging, sending packet for other server, etc.
