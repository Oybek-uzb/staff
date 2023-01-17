'use strict';

/**
 * sitelist service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sitelist.sitelist');
