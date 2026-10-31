module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-redux|redux|@reduxjs/toolkit|immer|reselect|@standard-schema|@react-native-async-storage|react-native-svg|react-native-screens|react-native-safe-area-context)/)',
  ],
};
