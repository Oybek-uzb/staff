'use strict';

/**
 * clipboard controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::clipboard.clipboard');
