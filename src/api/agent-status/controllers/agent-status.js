'use strict';

/**
 * agent-status controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::agent-status.agent-status');
module.exports = createCoreController('api::agent-status.agent-status', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::agent-status.agent-status').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::agent-status.agent-status').findOne(id, _query)
      return res
    }
  }
))

