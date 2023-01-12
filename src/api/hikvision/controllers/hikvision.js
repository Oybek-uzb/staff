'use strict';

/**
 * hikvision controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::hikvision.hikvision');


module.exports = createCoreController('api::hikvision.hikvision', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::hikvision.hikvision').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::hikvision.hikvision').findOne(id, _query)
      return res
    }
  }
))
