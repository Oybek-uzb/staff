module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/client/data/searchs',
      handler: 'websearch.search',
      config: {
      },
    }
  ],
};
