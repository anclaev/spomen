const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/oauth'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        {
          input: 'apps/oauth/keys',
          output: 'keys',
          glob: '**/*',
        },
        {
          input: 'apps/oauth/templates',
          output: 'templates',
          glob: '**/*',
        },
      ],
      optimization:
        process.env['NODE_ENV'] === 'production' ||
        process.env['NODE_ENV'] === 'staging',
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
}
