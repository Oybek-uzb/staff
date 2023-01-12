'use strict';

/**
 * company controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::company.company');

module.exports = createCoreController('api::company.company', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::company.company').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::company.company').findOne(id, _query)
      return res
    }
  }
))

