'use strict';

/**
 * permit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::permit.permit');
