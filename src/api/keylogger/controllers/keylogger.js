'use strict';

/**
 * keylogger controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


const utils = require('../../../utils')
const lodash = require("lodash");
const { customError, uploader, parseJwt } = utils

module.exports = createCoreController('api::keylogger.keylogger', ({strapi}) => ({
  async keylog (ctx) {
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
      const { Icon, DateTime, Title, Process, Content } = item

      if (!Icon) return customError(ctx, 'Icon is required')
      if (!DateTime) return customError(ctx, 'DateTime is required')
      if (!Title) return customError(ctx, 'Title is required')
      if (!Process) return customError(ctx, 'Process is required')
      if (!Content) return customError(ctx, 'Content is required')
    }
    for await (const item of _body) {
      const { Icon, DateTime, Title, Process, Content } = item
      const _data = {
        dateTime: DateTime,
        employee: _token.id,
        title: Title,
        content: Content,
        process: Process,
        icon: await uploader(Icon)
      }

      await strapi.entityService.create('api::keylogger.keylogger', {
        data: _data
      });
    }

    return {
      success: true,
      message: 'Keylogger created successfully',
      modules: 'activewindow, websniffer,keylogger,screenshot'
    }
  }
}));
