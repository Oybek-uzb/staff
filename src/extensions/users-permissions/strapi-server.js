const service = require('./service')
const { register } = service


const sanitizeOutput = (user) => {
  const {
    password, resetPasswordToken, confirmationToken, ...sanitizedUser
  } = user; // be careful, you need to omit other private attributes yourself
  return sanitizedUser;
};


module.exports = (plugin) => {
  plugin.controllers.user.me = async(ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      { populate: ['role', 'company'] }
    );
    ctx.body = sanitizeOutput(user);
  }
  plugin.controllers.auth.register = register
  return plugin;
}
