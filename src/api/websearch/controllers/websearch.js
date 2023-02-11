'use strict';

/**
 * websearch controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const utils = require('../../../utils')
const { customError, parseJwt } = utils


module.exports = createCoreController('api::websearch.websearch', ({strapi}) => ({
  async search (ctx) {
    const { authorization } = ctx.request.headers
    const body = ctx.request.body
    const _token = await parseJwt(authorization, ctx)
    if (!_token) return customError(ctx, 'Token is invalid')
    const employee = await strapi.entityService.findOne('api::employee.employee', _token.id, {
      populate: '*'
    });

    if (!employee) return customError(ctx, 'Employee is not found. Check your token')
    if (!body) return customError(ctx, 'Body must be array')
    if (!body.length) return customError(ctx, 'Body is empty')

    for await (const item of body) {
      const { Host, DateTime, Text, UserAgent } = item
      if (!Host) return customError(ctx, 'Host is required')
      if (!DateTime) return customError(ctx, 'DateTime is required')
      if (!Text) return customError(ctx, 'Text is required')
    }
    for await (const item of body) {
      const { Host, DateTime, Text, UserAgent } = item
      const _data = {
        dateTime: DateTime,
        employee: employee.id,
        text: Text,
        browser: UserAgent,
        host: Host
      }
      await strapi.entityService.create('api::websearch.websearch', {
        data: _data
      });
    }
    return {
      success: true,
      message: 'WebSearches created successfully',
      modules: 'activewindow, websniffer,keylogger,screenshot'
    }
  }
}));
