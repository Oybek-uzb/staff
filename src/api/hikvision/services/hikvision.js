'use strict';

/**
 * hikvision service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hikvision.hikvision');
