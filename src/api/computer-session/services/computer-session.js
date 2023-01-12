'use strict';

/**
 * computer-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::computer-session.computer-session');
