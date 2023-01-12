'use strict';

/**
 * printing controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::printing.printing');

module.exports = createCoreController('api::printing.printing', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::printing.printing').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::printing.printing').findOne(id, _query)
      return res
    }
  }
))

