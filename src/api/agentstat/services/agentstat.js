'use strict';

/**
 * agentstat service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::agentstat.agentstat');
