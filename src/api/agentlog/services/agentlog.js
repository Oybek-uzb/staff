'use strict';

/**
 * agentlog service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::agentlog.agentlog');
