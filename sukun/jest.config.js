/** Saf mantık katmanı (hesaplar, doğrulayıcılar) ts-jest ile node ortamında
 *  sınanır; bileşen testleri FAZ 18'de react-native preset'iyle eklenir. */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
