module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  roots: ['<rootDir>'],
  // Aggressively transform ESM node_modules for Jest compatibility
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|react-syntax-highlighter|lottie-react|devlop|remark-.*|unist-.*|micromark-.*|vfile|@babel/.*|@mui/.*|hast-util-to-jsx-runtime|property-information|space-separated-tokens|comma-separated-tokens|zwitch|bail|is-plain-obj|trough|web-namespaces|ccount|decode-named-character-reference|is-alphanumerical|is-decimal|is-hexadecimal|is-plain-obj|is-whitespace-character|is-word-character|is-svg-element|estree-util-is-identifier-name)/)'
  ]
};
