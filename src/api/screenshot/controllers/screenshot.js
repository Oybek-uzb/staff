'use strict';

/**
 * screenshot controller
 */

const utils = require('../../../utils')
const lodash = require("lodash");
const { uploadStream, customError, uploader, parseJwt } = utils
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::screenshot.screenshot', ({strapi}) => ({
  async screenshot (ctx) {
    const { authorization } = ctx.request.headers
    const _token = await parseJwt(authorization, ctx)
    if (!_token) return customError(ctx, 'Token is invalid')
    const employee = await strapi.entityService.findOne('api::employee.employee', _token.id, {
      populate: '*'
    });

    if (!employee) return customError(ctx, 'Employee is not found. Check your token')

    let { userData } = ctx.request.body
    const { files } = ctx.request.files
    const _userData = JSON.parse(userData)
    if (!lodash.isArray(files)) return customError(ctx, 'files is not array')
    if (!lodash.isArray(_userData)) return customError(ctx, 'userData is not array')

    let _temp = []
    for await (const file of files) {
      for await (const data of _userData) {
        console.log(file.name, data)
        if (file.name === data.Id) {
          delete data.id
          file.name = file.name + '.jpg'
          file.type = 'image/jpeg'
          _temp.push({
            ...data,
            file: file
          })
        }
      }
    }

    for await (const item of _temp) {
      const { file, DateTime, Title, ScreenName } = item
      const _data = {
        DateTime,
        Title,
        ScreenName,
        Screenshot: await uploadStream(file, 'screenshots'),
        employee: employee.id
      }
      await strapi.entityService.create('api::screenshot.screenshot', {
        data: _data
      });
    }
    return {
      success: true,
      message: 'Screenshoots created successfully',
      modules: 'activewindow, websniffer,keylogger,screenshot'
    }
  }
}));
