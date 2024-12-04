const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { join } = require('path')

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/auth'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      assets: [
        {
          input: 'libs/core/src/lib/protos',
          output: 'protos',
          glob: '**/*',
        },
      ],
      tsConfig: './tsconfig.app.json',
      optimization:
        process.env['NODE_ENV'] === 'production' ||
        process.env['NODE_ENV'] === 'staging',
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
}
