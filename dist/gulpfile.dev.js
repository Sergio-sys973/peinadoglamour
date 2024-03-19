"use strict";

var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest,
    watch = _require.watch,
    series = _require.series,
    parallel = _require.parallel;

var sass = require('gulp-sass')(require('sass'));

var autoprefixer = require('autoprefixer');

var postcss = require('gulp-postcss');

var sourcemaps = require('gulp-sourcemaps');

var cssnano = require('cssnano');

var concat = require('gulp-concat');

var terser = require('gulp-terser-js');

var rename = require('gulp-rename');

var imagemin = require('gulp-imagemin'); // Minificar imagenes 


var notify = require('gulp-notify');

var cache = require('gulp-cache');

var clean = require('gulp-clean');

var webp = require('gulp-webp');

var paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  imagenes: 'src/img/**/*'
}; // css es una función que se puede llamar automaticamente

function css() {
  return src(paths.scss).pipe(sourcemaps.init()).pipe(sass()).pipe(postcss([autoprefixer(), cssnano()])) // .pipe(postcss([autoprefixer()]))
  .pipe(sourcemaps.write('.')).pipe(dest('public/build/css'));
}

function javascript() {
  return src(paths.js).pipe(terser()).pipe(sourcemaps.write('.')).pipe(dest('public/build/js'));
}

function imagenes() {
  return src(paths.imagenes).pipe(cache(imagemin({
    optimizationLevel: 3
  }))).pipe(dest('public/build/img')).pipe(notify({
    message: 'Imagen Completada'
  }));
}

function versionWebp() {
  return src(paths.imagenes).pipe(webp()).pipe(dest('public/build/img')).pipe(notify({
    message: 'Imagen Completada'
  }));
}

function watchArchivos() {
  watch(paths.scss, css);
  watch(paths.js, javascript);
  watch(paths.imagenes, imagenes);
  watch(paths.imagenes, versionWebp);
}

exports.css = css;
exports.watchArchivos = watchArchivos;
exports["default"] = parallel(css, javascript, imagenes, versionWebp, watchArchivos);
exports.build = parallel(css, javascript, imagenes, versionWebp);
//# sourceMappingURL=gulpfile.dev.js.map
