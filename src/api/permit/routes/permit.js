'use strict';

/**
 * permit router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::permit.permit');
