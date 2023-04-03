module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/events/attendances',
      handler: 'event.attendances',
      config: {}
    },
    {
      method: 'GET',
      path: '/events/attendances_v2',
      handler: 'event.attendances_v2',
      config: {}
    }
  ]
}
