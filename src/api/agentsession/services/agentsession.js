'use strict';

/**
 * agentsession service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::agentsession.agentsession');
