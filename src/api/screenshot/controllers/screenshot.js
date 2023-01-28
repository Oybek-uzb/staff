'use strict';

/**
 * screenshot controller
 */

const utils = require('../../../utils')
const { uploadStream, customError, uploader, parseJwt } = utils
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::screenshot.screenshot', ({strapi}) => ({
  async screenshot (ctx) {
    const { userData } = ctx.request.body
    const { files } = ctx.request.files
    for await (const file of files) {
      await uploadStream(file, 'screenshots')
    }
    return {
      userData: JSON.parse(userData),
      files
    }

    // const { authorization } = ctx.request.headers
    // const _token = await parseJwt(authorization, ctx)
  }
}));
