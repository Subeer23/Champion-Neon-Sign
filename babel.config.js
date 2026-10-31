module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Zod 4 publishes ESM namespace exports; Metro needs this transform.
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
