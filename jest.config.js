// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Handle module aliases from tsconfig.json
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle other asset imports
    '^.+\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(woff|woff2|eot|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Don't transform node_modules except for specific packages that need it
  transformIgnorePatterns: [
    '/node_modules/(?!(katex|@radix-ui|@babel|@testing-library|@floating-ui|react-markdown|micromark|rehype|vfile|unist-util-|unified|bail|is-plain-obj|trough|vfile-message|decode-named-character-reference|character-entities|mdast-util-|ccount|markdown-table|parse-entities|stringify-entities|zwitch|longest-streak|fault|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|hast-util-parse-selector|web-namespaces|hastscript|hast-util-from-parse5|hast-util-parse-selector|hast-util-to-parse5|hast-util-raw|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw|hast-util-parse-selector|hast-util-from-parse5|hast-util-to-parse5|hast-util-raw))/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Test path patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/.vercel/',
    '<rootDir>/cypress/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/out/',
  ],
  
  // Transform settings
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Collect coverage
  collectCoverage: false, // Set to true to collect coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/styles.{js,jsx,ts,tsx}',
    '!src/pages/_app.{js,jsx,ts,tsx}',
    '!src/pages/_document.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
