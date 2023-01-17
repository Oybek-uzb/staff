'use strict';

/**
 * websearch service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::websearch.websearch');
