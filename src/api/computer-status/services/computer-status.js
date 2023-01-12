'use strict';

/**
 * computer-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::computer-status.computer-status');
