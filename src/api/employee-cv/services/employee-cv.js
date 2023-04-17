'use strict';

/**
 * employee-cv service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-cv.employee-cv');
