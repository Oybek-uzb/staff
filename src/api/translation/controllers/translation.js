'use strict';

/**
 * translation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::translation.translation');
module.exports = createCoreController('api::translation.translation', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::translation.translation').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::translation.translation').findOne(id, _query)
      return res
    }
  }
))

