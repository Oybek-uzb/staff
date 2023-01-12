'use strict';

/**
 * computer-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::computer-session.computer-session');

module.exports = createCoreController('api::computer-session.computer-session', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::computer-session.computer-session').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::computer-session.computer-session').findOne(id, _query)
      return res
    }
  }
))

