const gulp = require('gulp');
const browserify = require('gulp-browserify');
const eslint = require('gulp-eslint');
const debug = require('gulp-debug');
const del = require('del');
const rename = require('gulp-rename');
const sequence = require('run-sequence');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
require('gulp-graph')(gulp);

gulp.task('browserify', ['clear'], () => {
	return gulp.src('src/app.js')
		.pipe(plumber({errorHandler: notify.onError(err => {
			return {
				title: 'browserify',
				message: err.message
			};
		})}))
		.pipe(debug({title: 'src'}))
		.pipe(browserify({
			insertGlobals: true
		}))
		.pipe(debug({title: 'browserify'}))
		.pipe(rename('build.js'))
		.pipe(debug({title: 'rename'}))
		.pipe(gulp.dest('dest'));
});

gulp.task('build', () => {
	return sequence('clear', ['browserify', 'assets']);
});

gulp.task('assets', () => {
	return gulp.src('src/assets/**')
		.pipe(debug({title: 'assets'}))
		.pipe(gulp.dest('dest'));
});

gulp.task('lint', () => {
	return gulp.src('./src/**/*.js')
		// .pipe(debug({title: 'src:'}))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('clear', ['lint'], () => {
	return del(['dest/**/*'])
		.then(
			paths => console.log(paths.join('\n')),
			err => console.log(err)
		);
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.js', ['browserify']);
	gulp.watch('src/assets/**/*.*', ['assets']);
});

gulp.task('serve', () => {
	browserSync.init({
		server: 'dest'
	});

	browserSync.watch('dest/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', () => {
	return sequence('build', ['watch', 'serve']);
});

gulp.task('default', ['dev']);