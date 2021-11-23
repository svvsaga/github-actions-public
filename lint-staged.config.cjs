module.exports = require('node-modules-public').lintStagedConfig({
  extras: {
    '**/*.ts': () => ['npm run all', 'git add .'],
  },
})
