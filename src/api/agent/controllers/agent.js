'use strict';

/**
 * agent controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::agent.agent');

module.exports = createCoreController('api::agent.agent', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::agent.agent').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::agent.agent').findOne(id, _query)
      return res
    }
  }
))
