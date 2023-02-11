'use strict';

/**
 * webvisiting controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const utils = require('../../../utils')
const { customError, parseJwt } = utils

module.exports = createCoreController('api::webvisiting.webvisiting', ({strapi}) => ({
  async visits (ctx) {
    const { authorization } = ctx.request.headers
    const _token = await parseJwt(authorization, ctx)
    if (!_token) return customError(ctx, 'Token is invalid')
    const employee = await strapi.entityService.findOne('api::employee.employee', _token.id, {
      populate: '*'
    });

    if (!employee) return customError(ctx, 'Employee is not found. Check your token')

    const { Host, DateTime, Title, Page, Time, UserAgent } = ctx.request.body
    //
    if (!Host) return customError(ctx, 'Host is required')
    if (!DateTime) return customError(ctx, 'DateTime is required')
    if (!Title) return customError(ctx, 'Title is required')
    if (!Page) return customError(ctx, 'Page is required')
    if (!Time) return customError(ctx, 'Time is required')
    //
    const _data = {
      dateTime: DateTime,
      employee: employee.id,
      title: Title,
      browser: UserAgent,
      duration: parseInt(Time),
      host: Host,
      page: Page
    }

    // return _data
    //
    await strapi.entityService.create('api::webvisiting.webvisiting', {
      data: _data
    });
    return {
      success: true,
      message: 'Webvisiting created successfully',
      modules: 'activewindow, websniffer,keylogger,screenshot'
    }
  }
}));
