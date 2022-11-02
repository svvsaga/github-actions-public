import { lintStagedConfig } from 'node-modules-public'

export default lintStagedConfig({
  extras: {
    '**/*.ts': () => ['npm run all', 'git add .'],
  },
  ignoreLargeFilesRegex: /index\.js/,
})
