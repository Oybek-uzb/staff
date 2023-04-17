'use strict';

/**
 * language-level controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::language-level.language-level');
