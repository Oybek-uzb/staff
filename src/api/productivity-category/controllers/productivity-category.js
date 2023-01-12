'use strict';

/**
 * productivity-category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::productivity-category.productivity-category');

module.exports = createCoreController('api::productivity-category.productivity-category', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::productivity-category.productivity-category').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::productivity-category.productivity-category').findOne(id, _query)
      return res
    }
  }
))
