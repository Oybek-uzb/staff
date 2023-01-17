'use strict';

/**
 * keylogger service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::keylogger.keylogger');
