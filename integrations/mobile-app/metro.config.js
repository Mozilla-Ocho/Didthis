const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  let config = getDefaultConfig(__dirname);

  config.resolver.resolverMainFields.unshift("sbmodern");

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
  };

  return config;
})();
