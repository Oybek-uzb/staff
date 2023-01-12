'use strict';

/**
 * computer-status controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::computer-status.computer-status');

module.exports = createCoreController('api::computer-status.computer-status', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::computer-status.computer-status').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::computer-status.computer-status').findOne(id, _query)
      return res
    }
  }
))
