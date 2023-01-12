'use strict';

/**
 * device-type controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::device-type.device-type');

module.exports = createCoreController('api::device-type.device-type', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::device-type.device-type').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::device-type.device-type').findOne(id, _query)
      return res
    }
  }
))

