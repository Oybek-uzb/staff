'use strict';

/**
 * language-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::language-level.language-level');
