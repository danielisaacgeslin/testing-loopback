'use strict';
var pjson = require('./package.json');
var connect = require('gulp-connect');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var inject = require('gulp-inject');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var tslint = require('gulp-tslint');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var logger = require('gulp-logger');
var colors = require('colors');
var Server = require('karma').Server;

var tsProject = ts.createProject('tsconfig.json');

/*usable from terminal*/
gulp.task('dev', function(){
  console.log('development process started'.bgWhite.black);
  runSequence(
  'clean',
  'ts',
  'rootAssets',
  'main',
  'move-js',
  'index-dev',
  ['build-css','move-html','images','fonts','libs'],
  ['test','lint'],
  ['watch','connect'],
  function(){
    console.log('ready to develop'.bgGreen.black);
  });
});

gulp.task('build', function(){
  console.log('build started'.bgWhite.black);
  runSequence(
  'clean',
  'ts',
  'rootAssets',
  'main',
  'minify-main',
  'bundle-minify-js',
  'index-prd',
  ['build-css','minify-html','images','fonts','libs'],
  ['test','lint'],
  function(){
    console.log('build complete'.bgGreen.black);
  }
);
});

/*end usable from terminal*/

gulp.task('connect', function() {
  return connect.server({
    name: pjson.name,
  	root: ['./public/'],
    port: 3000,
    livereload: true,
    fallback: './public/index.html'
  });
});

gulp.task('clean', function () {
    return gulp.src(['./public/','./jshint-output.log'], {read: false})
        .pipe(clean());
});

gulp.task('test', function () {
  console.log('running tests'.bgWhite.black);
  var a = new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  },function(e){
    console.log(e.toString().concat(' error/s')[e ? 'bgRed' : 'bgGreen'].black);
  }).start();
});

gulp.task('lint', function() {
  return gulp.src(['./app/**/*.ts'])
    .pipe(tslint({
      configuration: "./tslint.json"
    }))
    .pipe(tslint.report())
    .on('error', function(e){
      this.emit('end')
      console.log('lint error/s'['bgRed'].black);
    })
});

gulp.task('images', function(){
	return gulp.src('./images/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./public/images'));
});

gulp.task('move-js', function() {
	return gulp.src(['./app/**/*.js', '!./app/**/*.spec.js'])
	.pipe(gulp.dest('public/app/'));
});

gulp.task('bundle-minify-js', function() {
    return gulp.src(['./app/**/*.js', '!./app/**/*.spec.js'])
  	.pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify({mangle:true}))
  	.pipe(gulp.dest('public/js/'));
});

gulp.task('main', function() {
	return browserify('./vendors.js')
	.bundle().pipe(source('vendors.js'))
	.pipe(gulp.dest('public/js/'));
});

gulp.task('minify-main', function() {
  return gulp.src('public/js/vendors.js')
    .pipe(uglify({mangle:true}))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function() {
	return gulp.src('./sass/style.scss')
			.pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('public/css'));
});

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('libs', function() {
  return gulp.src('libs/*.*')
    .pipe(gulp.dest('public/libs/'));
});

gulp.task('minify-html', function() {
  return gulp.src('./app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/'));
});

gulp.task('move-html', function() {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('fonts', function(){
  return gulp.src('./fonts/**/*.*')
  .pipe(gulp.dest('./public/fonts'));
});

gulp.task('build-css', function(){
  runSequence('sass','minify-css');
});

gulp.task('ts', function(){
  return gulp.src(['./typings/**/*.ts','./app/**/*.ts'])
  .pipe(tsProject())
  .pipe(gulp.dest('./app'));
});

gulp.task('update-js', function(){
  console.log('updating js'.bgWhite.black);
  runSequence('lint','ts', 'move-js', 'test', 'livereload', function(){
    console.log('js updated'.bgGreen.black);
  });
});

gulp.task('update-css', function(){
  console.log('updating css'.bgWhite.black);
  runSequence('sass','minify-css', 'livereload', function(){
    console.log('css updated'.bgGreen.black);
  });
});

gulp.task('update-html', function(){
  console.log('updating html'.bgWhite.black);
  runSequence('move-html', 'livereload', function(){
    console.log('html updated'.bgGreen.black);
  });
});

gulp.task('livereload', function(){
  console.log(colors.black('reloading browser').bgMagenta);
  gulp.src('./public/**/*.*')
    .pipe(connect.reload());
});

gulp.task('rootAssets', function(){
  return gulp.src(['./rootAssets/**','./rootAssets/.htaccess'])
  .pipe(gulp.dest('./public'));

});

gulp.task('index-dev', function () {
  var target = gulp.src('./app/index.html')
  var sources =  gulp.src(['./app/**/*.js', '!./app/**/*spec.js'], {read: false});
  return target
  .pipe(inject(sources, {ignorePath: 'public'}))
  .pipe(gulp.dest('./app/'));
});

gulp.task('index-prd', function () {
  var target = gulp.src('./app/index.html')
  var sources =  gulp.src(['./public/js/app.js'], {read: false});
  return target
  .pipe(inject(sources, {ignorePath: 'public'}))
  .pipe(gulp.dest('./app/'));
});

gulp.task('watch', function(){
	gulp.watch('libs/**/*.*', ['libs']);
  gulp.watch('app/**/*.ts', ['update-js']);
	gulp.watch('./sass/*.scss', ['update-css']);
	gulp.watch('app/**/*.html', ['update-html']);
	gulp.watch('images/**/*', ['images']);
  gulp.watch('app/**/*.spec.js', ['test']);
});
