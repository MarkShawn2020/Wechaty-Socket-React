/* config-overrides.js */
module.exports = function override(config, env) {
  config = require("react-app-rewire-styled-components")(config, env)
  // config = require("react-app-rewire-scss")(config, env)
  return config
}
