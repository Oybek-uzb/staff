'use strict';

/**
 * activewindow controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const utils = require('../../../utils')
const lodash = require('lodash')
const { customError, uploader, parseJwt } = utils


module.exports = createCoreController('api::activewindow.activewindow', ({strapi}) => ({
  async activeWindow (ctx) {
    const { authorization } = ctx.request.headers
    const _token = await parseJwt(authorization, ctx)
    if (!_token) return customError(ctx, 'Token is invalid')
    const employee = await strapi.entityService.findOne('api::employee.employee', _token.id, {
      populate: '*'
    });

    if (!employee) return customError(ctx, 'Employee is not found. Check your token')
    const _body = ctx.request.body

    if (!lodash.isArray(_body))return customError(ctx, 'Body is not array')

    for await (const item of _body) {
      const { Icon, DateTime, Title, Process, ActiveTime } = item

      if (!Icon) return customError(ctx, 'Icon is required')
      if (!DateTime) return customError(ctx, 'DateTime is required')
      if (!Title) return customError(ctx, 'Title is required')
      if (!Process) return customError(ctx, 'Process is required')
      if (!ActiveTime) return customError(ctx, 'ActiveTime is required')
    }
    for await (const item of _body) {
      const { Icon, DateTime, Title, Process, ActiveTime } = item
      const _data = {
        dateTime: DateTime,
        employee: _token.id,
        title: Title,
        time: ActiveTime,
        process: Process,
        icon: await uploader(Icon)
      }

      await strapi.entityService.create('api::activewindow.activewindow', {
        data: _data
      });
    }

    return {
      success: true,
      message: 'Activewindows created successfully',
      modules: 'activewindow,websniffer,keylogger,screenshot'
    }
  }
}));
