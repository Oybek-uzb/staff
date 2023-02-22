'use strict';

/**
 * employee-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-type.employee-type');
