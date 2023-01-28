module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/client/data/screenshot',
      handler: 'screenshot.screenshot',
      config: {
      },
    }
  ],
};
