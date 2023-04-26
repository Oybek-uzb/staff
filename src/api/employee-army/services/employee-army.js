'use strict';

/**
 * employee-army service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee-army.employee-army');
