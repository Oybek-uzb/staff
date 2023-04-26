'use strict';

/**
 * employee-travel service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-travel.employee-travel');
