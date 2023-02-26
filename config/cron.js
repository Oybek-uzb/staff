const service = require('./service')
const { backUpEvents, getEventsHikVision } = service
const md5 = require('md5')

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */




  '0/5 * * * * *': async ({ strapi }) => {
    const hikvisions = await strapi.entityService.findMany('api::hikvision.hikvision');
    hikvisions.filter(el => el['isBackUp']).forEach(e => getEventsHikVision(e))
    // console.log(md5(Date.now().toString()))
    // await backUpEvents(['s'])
    // console.log('5s', hikvisions)
    // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
  },
};
