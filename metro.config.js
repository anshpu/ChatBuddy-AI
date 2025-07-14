const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

module.exports = (async () => {
    // Get the default config first
    const config = await getDefaultConfig(__dirname);
    const { resolver: { sourceExts, assetExts } } = config;

    // Add SVG transformer configuration
    config.transformer = {
        ...config.transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        minifierPath: 'metro-minify-terser',  // Add proper minifier for production
        minifierConfig: {
            // Terser options for production build
            ecma: 8,
            compress: { drop_console: true },  // Remove console logs in production
            mangle: true
        }
    };

    // Update resolver for SVG files
    config.resolver = {
        ...config.resolver,
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
        // Ensure node_modules are properly resolved
        extraNodeModules: new Proxy({}, {
            get: (target, name) => {
                return path.join(process.cwd(), `node_modules/${name}`)
            }
        })
    };

    // Apply NativeWind and return the final config
    return withNativeWind(config, { input: './app/globals.css' });
})();