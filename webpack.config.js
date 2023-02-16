const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/ts/index.ts',
  },
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: ['src/**/*.html', 'src/scss/**/*.scss'],
    static: {
      directory: path.join(__dirname, 'dist/'),
    },
    client: {
      progress: true,
    },
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Puppy\'s Todo List',
      template: 'src/index.html',
      // inject: false,
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss?$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          // Resolves url() and rewrites them
          'resolve-url-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              warnRuleAsWarning: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '...'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
    clean: true,
  },
};
