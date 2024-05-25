const config = {
  port: +process.env.PORT || 3131,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
module.exports = config;
