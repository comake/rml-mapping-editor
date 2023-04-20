const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const path = require( 'path' );
const fs = require('fs');
const webpack = require('webpack');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrl = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

module.exports = {
  target: 'web',
  context: __dirname,
  entry: './public/index.tsx',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'main.js',
    publicPath: publicUrl,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    fallback: {
      'stream': require.resolve('stream-browserify'),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
            }
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|j?g|gif)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'images/[name]-[hash].[ext]',
            },
          },
        ],
        issuer: {
          and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
        },
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve( __dirname, 'public/index.html' ),
      filename: 'index.html'
    }),
    new InterpolateHtmlPlugin(HtmlWebPackPlugin, {
      PUBLIC_URL: publicUrl.slice(0, -1),
      // You can pass any key-value pairs, this was just an example.
      // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  ],
  ignoreWarnings: [
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes("node_modules") &&
        warning.details &&
        warning.details.includes("source-map-loader")
      );
    },
  ],
};