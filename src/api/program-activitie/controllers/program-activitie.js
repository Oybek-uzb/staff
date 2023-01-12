'use strict';

/**
 * program-activitie controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::program-activitie.program-activitie');

module.exports = createCoreController('api::program-activitie.program-activitie', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::program-activitie.program-activitie').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::program-activitie.program-activitie').findOne(id, _query)
      return res
    }
  }
))
