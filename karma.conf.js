// Karma configuration
// Generated on Tue Jan 06 2015 15:32:18 GMT-0600 (Central Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/breeze-client/build/breeze.min.js',
      'bower_components/breeze-client/build/adapters/breeze.bridge.angular.js',
      'bower_components/lodash/lodash.min.js',

      'node_modules/angular-mocks/angular-mocks.js',

      'modules/angular-360.module.js',
      'common/**/*.js',
      'directives/**/*.js',
      'services/**/*.js',
      'filters/**/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'bamboo'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'IE', 'IE9', 'PhantomJS'],
    browsers: ['PhantomJS'],


    customLaunchers: {
        IE9: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE9'
        },
        IE8: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE8'
        }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
