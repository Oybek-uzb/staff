'use strict';

/**
 * agent-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::agent-status.agent-status');
