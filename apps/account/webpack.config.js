const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/account'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        {
          input: 'libs/core/src/lib/protos',
          output: 'protos',
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
