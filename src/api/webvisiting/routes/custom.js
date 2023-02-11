module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/client/data/visitingsites',
      handler: 'webvisiting.visits',
      config: {
      },
    }
  ],
};
