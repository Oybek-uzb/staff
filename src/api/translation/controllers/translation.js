'use strict';

/**
 * translation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::translation.translation');
module.exports = createCoreController('api::translation.translation', ({strapi}) => ({
    async find(ctx) {
      const _query = {...ctx.query}
      const {results, pagination} = await strapi.service('api::translation.translation').find(_query);
      return {results, pagination};
    },
    async findOne(ctx) {
      const _query = {...ctx.query}
      const _params = {...ctx.params}
      const {id} = _params
      const res = await strapi.service('api::translation.translation').findOne(id, _query)
      return res
    },
    async getByLang (ctx) {
      const _params = {...ctx.params}
      const { lang } = _params
      const entries = await strapi.entityService.findMany('api::translation.translation', {});
      return entries.reduce((a, v) => ({ ...a, [v.key]: v[lang]}), {})
      // return entries
    },
    async setLang (ctx) {
      const _body = {...ctx.request.body}
      const key = Object.keys(_body)[0]
      const value = Object.values(_body)[0]
      const entry = await strapi.entityService.create('api::translation.translation', {
        data: {
          key: key,
          uz: value,
          en: value,
          ru: value
        }
      });
      return entry
    }
  }
))

