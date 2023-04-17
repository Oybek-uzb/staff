'use strict';

/**
 * language-level router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::language-level.language-level');
