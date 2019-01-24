'use strict';

var gulp          = require('gulp'),
    plugins       = require('gulp-load-plugins')(),
    browserSync   = require('browser-sync').create();


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false,
    //open: false
  })
});

gulp.task('styles', function() {
  return gulp.src('app/scss/main.scss')
    .pipe(plugins.sass({outputStyle: 'expand'}).on("error", plugins.notify.onError({
      title: "style"
    })))
    .pipe(plugins.rename({ suffix: '.min', prefix : '' }))
    .pipe(plugins.autoprefixer(['last 15 versions']))
    .pipe(plugins.csso())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/popper/popper.min.js',
    'app/libs/bootstrap/dist/js/bootstrap.min.js',
    'app/libs/fontawesome/js/all.min.js',
    'app/libs/Magnific-Popup-master/dist/jquery.magnific-popup.min.js',
  ])
    .pipe(plugins.concat('scripts.min.js'))
    .pipe(plugins.uglify()) // Mifify js (opt.)
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
  return gulp.src('app/*.html')
  .pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss',gulp.series('styles'));
  gulp.watch(['libs/**/*.js', 'app/js/main.js'],gulp.series('js'));
  gulp.watch("app/*.html",gulp.series('code'))
});


gulp.task('build',function (done) {
  var buildFiles = gulp.src([
    'app/*.html',
    'app/*.php'
  ]).pipe(gulp.dest('dist'));

  var buildCss = gulp.src([
    'app/css/**/*.css'
  ]).pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src([
    'app/fonts/**/*'
  ]).pipe(gulp.dest('dist/fonts'));

  var buildImg = gulp.src([
    'app/img/**/*'
  ]).pipe(gulp.dest('dist/img'));
  done();
});



gulp.task('default',gulp.series(
  gulp.parallel('styles', 'js', 'code'),
  gulp.parallel('watch', 'serve')
));

