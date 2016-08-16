//#region Requires

var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var config = require('./gulp.config.json');
var merge = require('merge-stream');
// var plato = require('plato');
var glob = require('glob');
var del = require('del');
var util = require('gulp-util');
var concat = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var log = util.log;
var karma = require('karma').server;
var bump = require('gulp-bump');
var header = require('gulp-header');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var insert = require('gulp-insert');

//#endregion

//#region Tasks

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function () {
    log('Analyzing source with JSHint, JSCS, and Plato');

    var jshint = analyzejshint([].concat(config.js, config.specs));
    var jscs = analyzejscs(config.js);

    //startPlatoVisualizer();

    return merge(jshint, jscs);
});

gulp.task('bowerjson', function () {
    return gulp.src('./bower.json')
        .pipe(gulpif((typeof argv.v !== 'undefined'), bump({ version: argv.v })))
        .pipe(gulp.dest(config.build));
});

/**
 * Minify and bundle the JavaScript
 * @return {Stream}
 */
gulp.task('js', ['bowerjson', 'templatecache'], function () {
        log('Bundling and minifying the JavaScript');

    var templatesPath = config.temp + config.templatesfilename;
    var alljs = [].concat(config.js, templatesPath);
    var pkg = require(config.build + 'bower.json');

    var banner = ['/**',
      ' * <%= pkg.name %> - <%= pkg.description %>',
      ' * @version v<%= pkg.version %>',
      ' * (c) 2016 D3 Automation  http://d3tech.net/solutions/automation/',
      ' * License: MIT',
      ' */',
      ''].join('\n');

    return gulp
        .src(alljs)
        .pipe(concat('angular-c360.debug.js'))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(ngAnnotate({
            add: true,
            single_quotes: true
        }))
        .pipe(gulp.dest(config.build))
        .pipe(rename('angular-c360.min.js'))
        .pipe(uglify({
            mangle: true
        }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(config.build));
});

/**
 * Combine html templates into .js template file
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    log('Creating template cache')

    return gulp
        .src(config.htmltemplates)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache(config.templatesfilename, {
            module: config.templatemodule,
            standalone: false
        }))
        .pipe(gulp.dest(config.temp));
});

/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', function () {
    log('Bundling and minifying the CSS');

    return gulp.src(config.css)
        .pipe(concat('angular-c360.css'))
        .pipe(gulp.dest(config.build))
        .pipe(rename('angular-c360.min.css'))
        .pipe(cleanCSS({}))
        .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build folder
 * @return {Stream}
 */
gulp.task('clean', function (cb) {
    log('Cleaning: ' + util.colors.blue(config.build));

    var delPaths = [].concat(config.build, config.report);
    del(delPaths, cb);
});

gulp.task('build', ['js', 'css']);

gulp.task('deploy-local', ['build'], function () {
    var js = gulp
        .src(config.build + '**/*.js')
        .pipe(gulp.dest(config.deployjs));

    var content = gulp
        .src(config.build + '**/*.css')
        .pipe(gulp.dest(config.deploycontent));

    return merge(js, content);
});

gulp.task('watch', function () {
    gulp.watch(config.js, ['deploy-local']);
    gulp.watch(config.css, ['deploy-local']);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('autotest', function (done) {
    startTests(false /*singleRun*/, done);
});

//#endregion

//#region Helper Functions

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    log(sources);
    return gulp
        .src(sources)
        .pipe(jshint(jshintrcFile))
        .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
        .src(sources)
        .pipe(jscs('./.jscsrc'));
}

/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer() {
    log('Running Plato');

    var excludeFiles = /\/src\/client\/app\/.*\.spec\.js/;
    var files = [];

    config.js.forEach(function (jsglob) {
        files.concat(glob.sync(jsglob));
    });
    //glob.sync(config.js);

    var options = {
        title: 'Plato Inspections Report',
        exclude: excludeFiles
    };
    var outputDir = './report/plato';

    plato.inspect(files, outputDir, options, platoCompleted);

    function platoCompleted(report) {
        var overview = plato.getOverviewReport(report);
        log(overview.summary);
    }
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var fork = require('child_process').fork;

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !!singleRun
    }, karmaCompleted);

    function childProcessCompleted(error, stdout, stderr) {
        log('stdout: ' + stdout);
        log('stderr: ' + stderr);
        if (error !== null) {
            log('exec error: ' + error);
        }
    }

    function karmaCompleted() {
        if (child) {
            child.kill();
        }
        done();
    }
}

//#endregion