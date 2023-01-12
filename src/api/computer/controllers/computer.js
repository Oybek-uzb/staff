'use strict';

/**
 * computer controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::computer.computer');

module.exports = createCoreController('api::computer.computer', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::computer.computer').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::computer.computer').findOne(id, _query)
      return res
    }
  }
))
