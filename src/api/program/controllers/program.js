'use strict';

/**
 * program controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::program.program');

module.exports = createCoreController('api::program.program', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::program.program').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::program.program').findOne(id, _query)
      return res
    }
  }
))
