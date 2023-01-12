'use strict';

/**
 * attandance controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::attandance.attandance', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::attandance.attandance').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::attandance.attandance').findOne(id, _query)
      return res
    }
  }
))

