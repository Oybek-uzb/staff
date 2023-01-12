'use strict';

/**
 * permit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::permit.permit');

module.exports = createCoreController('api::permit.permit', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::permit.permit').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::permit.permit').findOne(id, _query)
      return res
    }
  }
))

