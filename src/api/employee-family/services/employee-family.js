'use strict';

/**
 * employee-family service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-family.employee-family');
