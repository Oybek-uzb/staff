'use strict';

/**
 * doc-type controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::doc-type.doc-type');

module.exports = createCoreController('api::doc-type.doc-type', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::doc-type.doc-type').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::doc-type.doc-type').findOne(id, _query)
      return res
    }
  }
))


