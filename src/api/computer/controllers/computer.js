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

const jwt = require('jsonwebtoken');

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
      if (typeof InDomain !== 'boolean') return customError(ctx, 'InDomain is boolean')
      if (!Mac) return customError(ctx, 'Mac is required')
      if (!IP) return customError(ctx, 'IP is required')
      // if(!OS) return ctx.badRequest(null, { message: 'OS is required' })
      if (!Version) return customError(ctx, 'Version is required')


      const employee = await strapi.entityService.findMany('api::employee.employee', {
        filters: {userID: UserID}
      });
      const computer = await strapi.entityService.findMany('api::computer.computer', {
        filters: {pcId: PCID}
      });

      let _employee
      let _computer
      let isUpdated

      if (employee[0]) {
        _employee = await strapi.entityService.update('api::employee.employee', employee[0].id, {
          data: {
            firstName: GivenName,
            lastName: SureName,
            hostname: HostName,
            inDomain: InDomain
          },
        });
        isUpdated = true
      } else {
        _employee = await strapi.entityService.create('api::employee.employee', {
          data: {
            firstName: GivenName,
            lastName: SureName,
            hostname: HostName,
            userID: UserID,
            inDomain: InDomain
          }
        })
        const _token = jwt.sign({ id: _employee.id }, strapi.config.get('plugin.users-permissions.jwtSecret'), {expiresIn: 60 * 6000});
        _employee = await strapi.entityService.update('api::employee.employee', _employee.id, {
          data: { token: _token }
        })
      }
      if (computer[0]) {
        _computer = await strapi.entityService.update('api::computer.computer', computer[0].id, {
          data: {
            ip: IP,
            os: OS,
            mac: Mac,
            agentVersion: Version,
            pcName: PCName
          }
        })
      } else {
        _computer = await strapi.entityService.create('api::computer.computer', {
          data: {
            ip: IP,
            os: OS,
            mac: Mac,
            agentVersion: Version,
            pcId: PCID,
            pcName: PCName
          }
        })
      }
      _employee = await strapi.entityService.update('api::employee.employee', _employee.id, {
        data: { computer: _computer.id }
      })

      return {
        success: true,
        message: isUpdated ? 'Employee and Computer updated successfully' : 'Employee and Computer created successfully',
        token: _employee.token,
        modules: 'activewindow,websniffer,keylogger,screenshot'
      }
    }
  }
))
