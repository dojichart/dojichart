
const MODE = 'prod'; // or 'dev'

var pkg = require('./package.json');

// Gulp
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var runSequence = require('run-sequence');

// Utils
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var notify = require('gulp-notify');

// Transpiler
var babelify = require('babelify');
var source = require('vinyl-source-stream');

// Build Dependencies
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var concatCss = require('gulp-concat-css');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

// Documentation
var jsdoc = require('gulp-jsdoc3');

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
}


// Check coding format of sources
gulp.task('lint-client', function() {
  return gulp.src(['./index.js','./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Check coding format of test sources
gulp.task('lint-test', function() {
  return gulp.src('./test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// Add header to beginning of each source file
var headers_text = "/**\n"
                 + " * ${filename}\n"
                 + " * DojiChart - http://dojichart.com\n"
                 + " * Version: " + pkg.version + "\n"
                 + " *\n"
                 + " * Copyright © 2015-2016 Jay Wilson. All rights reserved.\n"
                 + " * Released under the GPLv3 license.\n"
                 + " * https://github.com/dojichart/dojichart/blob/master/LICENSE\n"
                 + " */\n";

gulp.task('headers', function() {
  return gulp.src(['./index.js','./src/**/*.js'])
    .pipe(wrapper({
      header: headers_text
    }))
    .pipe(gulp.dest('./dist/src'));
});


// Generate documentation using source file comments
gulp.task('jsdoc', function(done) {
  var config = require('./jsdocconfig');
  gulp.src(['./index.js', './src/**/*.js'], {read: false})
    .pipe(jsdoc(config, done));
});


// Create a Javascript bundle from node style modules that can be used in the browser
gulp.task('browserify-client', ['lint-client'], function() {
  var bundler = browserify({
    entries: ["./index.js"],
    debug: true,
    cache: {},
    packageCache: {}
  });
  bundler.transform(babelify.configure({presets: ["es2015"]}));
  var stream = bundler.bundle();
  return stream.on('error', handleErrors)
  //stream.on('error', handleErrors)
    .pipe(source("./index.js"))
    .pipe(rename({basename:"bundle"}))
    .pipe(gulp.dest("build"));
});


// Create a bundle out of the test modules
gulp.task('browserify-test', ['lint-test'], function() {
  var bundler = browserify({
    entries: ["./test/index.js"],
    debug: true,
    cache: {},
    packageCache: {}
  });
  bundler.transform(babelify.configure({presets: ["es2015"]}));
  var stream = bundler.bundle();
  return stream.on('error', handleErrors)
    .pipe(source("./test/index.js"))
    .pipe(rename("client-test.js"))
    .pipe(gulp.dest("build"));
});

// Execute Mocha tests using PhantomJS
gulp.task('test', ['lint-test', 'browserify-test'], function() {
  return gulp.src('test/index.html')
    .pipe(mochaPhantomjs());
});


// Watch for changes in the source and test source and re-run browserify-client / test accordingly
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['browserify-client', 'test']);
  gulp.watch('test/**/*.js', ['test']);
});


// Clean distribution directory
gulp.task('clean-dist', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});


// Compress CSS and output result to build/
gulp.task('minify-css', ['clean-dist'], function() {
  if(MODE === 'dev')
  {
    // Copy CSS to build/ without compression
    return gulp.src('./css/dojichart.css')
      .pipe(rename('dojichart.min.css')) // not minified
      .pipe(gulp.dest('build'))
  }
  else
  {
    return gulp.src('./css/**/*.css')
      .pipe(minifyCSS())
      .pipe(rename('dojichart.min.css'))
      .pipe(gulp.dest('build'));
  }
});


// Concatenate CSS and output result to build/
gulp.task('concat-css', ['clean-dist'], function() {
  return gulp.src('./css/**/*.css')
    .pipe(concatCss('dojichart.css')) // not minified
    .pipe(gulp.dest('build'));
});


// Copy bundle JavaScript and rename
gulp.task('copy-bundle', ['clean-dist'], function() {
  return gulp.src('./build/bundle.js')
    .pipe(rename('dojichart.js')) // not minified
    .pipe(gulp.dest('build'));
    //.on('end', done);
});


// Compress / obfuscate bundle JavaScript and output to build/
gulp.task('uglify-js', ['clean-dist', 'browserify-client'], function() {
  if(MODE === 'dev')
  {
    // Copy bundle JavaScript to build/ without uglification for development
    return gulp.src('./build/bundle.js')
      .pipe(rename('dojichart.min.js')) // not minified
      .pipe(gulp.dest('build'))
  }
  else
  {
    return gulp.src('./build/bundle.js')
      .pipe(uglify().on('error', gulp_util.log))
      .pipe(rename('dojichart.min.js'))
      .pipe(gulp.dest('build'))
  }
});


// Build (for development: no uglification / compression)
gulp.task('build', [
  'copy-bundle',
  'concat-css',
  'uglify-js',
  'minify-css'
], function() {
});


// Create distribution
gulp.task('create-dist', ['build'], function() {
  return gulp.src(["build/dojichart.js",
                   "build/dojichart.css",
                   "build/dojichart.min.css",
                   "build/dojichart.min.js",
                   "node_modules/jquery/dist/jquery.min.js"])
    .pipe(gulp.dest('dist'));
});


// Default
gulp.task('default', ['create-dist'], function() {
});






/*

  default
    > create-dist
      > build
        > copy-bundle
          > clean-dist
        > concat-css
        > uglify-js
          > browserify-client
            > lint-client
        > minify-css

*/

//gulp.task('build-dev', ['clean-dist'], function() {
//  runSequence('copy-bundle', 'concat-css', 'dev-copy-js', 'dev-copy-css', 'copy-vendor-files', done);
//});



//gulp.task('dev-copy-js', ['browserify-client'], function() {
//  return gulp.src('./build/bundle.js')
//    .pipe(rename('dojichart.min.js')) // not minified
//    .pipe(gulp.dest('build'))
//});


// Copy CSS to build/ without compression
//gulp.task('dev-copy-css', function() {
//  return gulp.src('./css/dojichart.css')
//    .pipe(rename('dojichart.min.css')) // not minified
//    .pipe(gulp.dest('build'))
//});

