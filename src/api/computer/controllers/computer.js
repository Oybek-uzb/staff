'use strict';

/**
 * computer controller
 */

const {createCoreController} = require('@strapi/strapi').factories;
const customError = (ctx, log) => {
  return ctx.send({
    success: false,
    message: log
  }, 400);
}

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
    },
    async clientCreate(ctx) {
      const body = {...ctx.request.body}
      const {PCID, UserID, PCName, HostName, GivenName, SureName, InDomain, Mac, IP, OS, Version} = body

      if (!PCID) return customError(ctx, 'PCID is required')
      if (!UserID) return customError(ctx, 'UserID is required')
      if (!PCName) return customError(ctx, 'PCName is required')
      // if(!HostName) return ctx.badRequest(null, { message: 'HostName is required' })
      // if(!GivenName) return ctx.badRequest(null, { message: 'GivenName is required' })
      if (!SureName) return customError(ctx, 'SureName is required')
      if (!InDomain) return customError(ctx, 'InDomain is required')
      if (!Mac) return customError(ctx, 'Mac is required')
      if (!IP) return customError(ctx, 'IP is required')
      // if(!OS) return ctx.badRequest(null, { message: 'OS is required' })
      if (!Version)return customError(ctx, 'Version is required')

      const _employee = await strapi.entityService.create('api::computer.computer', {
        data: {
          first_name: GivenName,
          last_name: SureName,
          hostname: HostName,

        }
      })
      const _computer = await strapi.entityService.create('api::computer.computer', {
        data: {
          ip: IP,
          os: OS,
          mac: Mac,
          agentVersion: Version,
          pcId: PCID,
          pcName: PCName
        }
      });
      return body
    }
  }
))
