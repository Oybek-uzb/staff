'use strict';

/**
 * keylogger router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::keylogger.keylogger');
