module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/lang/:lang',
      handler: 'translation.getByLang',
      config: {}
    }
  ]
}
