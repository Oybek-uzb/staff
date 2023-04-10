'use strict';

/**
 * webvisiting controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const utils = require('../../../utils')
const lodash = require("lodash");
const { customError, parseJwt } = utils

module.exports = createCoreController('api::webvisiting.webvisiting', ({strapi}) => ({
  async visits (ctx) {
    const { authorization } = ctx.request.headers
    const _token = await parseJwt(authorization, ctx)
    if (!_token) return customError(ctx, 'Token is invalid')
    const employee = await strapi.entityService.findOne('api::employee.employee', _token.id, {
      populate: '*'
    });

    const _body = ctx.request.body
    if (!employee) return customError(ctx, 'Employee is not found. Check your token')

    if (!lodash.isArray(_body)) return customError(ctx, 'Body is not array')

    for await (const item of _body) {
      const { Host, DateTime, Title, Page, Time, UserAgent } = item

      if (!Host) return customError(ctx, 'Host is required')
      if (!DateTime) return customError(ctx, 'DateTime is required')
      if (!Title) return customError(ctx, 'Title is required')
      if (!Page) return customError(ctx, 'Page is required')
      if (!Time) return customError(ctx, 'Time is required')
    }
    for await (const item of _body) {
      const { Host, DateTime, Title, Page, Time, UserAgent } = item
      const _data = {
        dateTime: DateTime,
        employee: employee.id,
        title: Title,
        browser: UserAgent,
        duration: parseInt(Time),
        host: Host,
        page: Page
      }
      await strapi.entityService.create('api::webvisiting.webvisiting', {
        data: _data
      });
    }
    return {
      success: true,
      message: 'Webvisiting created successfully',
      modules: 'activewindow, websniffer,keylogger,screenshot'
    }
  }
}));
