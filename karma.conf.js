// karma.conf.js
export default function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: [
      "src/**/*.spec.js"
    ],

    preprocessors: {
      "src/**/*.spec.js": ["webpack"]
    },

    webpack: {
      mode: "development",
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
    },

    reporters: ["progress", "kjhtml"],

    browsers: ["ChromeHeadless"],

    plugins: [
      "karma-jasmine",
      "karma-chrome-launcher",
      "karma-jasmine-html-reporter",
      "karma-webpack",            // ✅ importante
    ],

    singleRun: false,
  });
}
