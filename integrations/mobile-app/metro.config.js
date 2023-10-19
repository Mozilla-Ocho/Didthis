const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  let defaultConfig = await getDefaultConfig(__dirname);
  defaultConfig.resolver.resolverMainFields.unshift("sbmodern");
  return defaultConfig;
})();
