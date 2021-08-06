module.exports = {
  '**/*.ts': () => ['npm run all', 'git add .'],
  '**': (files) => [
    'scripts/check-for-secrets.ts ' + files.join(' '),
    'scripts/block-large-files.ts ' + files.join(' '),
  ],
}
