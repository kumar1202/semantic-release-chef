const verify = require("./src/verify-config");
const prepareCookbook = require("./src/prepare");
const publishCookbook = require("./src/publish");

async function verifyConditions(pluginConfig, context) {
  await verify(pluginConfig, context);
}

async function prepare(pluginConfig, context) {
  await prepareCookbook(pluginConfig, context);
}

async function publish(pluginConfig, context) {
  await publishCookbook(pluginConfig, context);
}

module.exports = { verifyConditions, prepare, publish };
