const gulp = require("gulp");
const plumber = require("gulp-plumber");
const { watch } = require('gulp');
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browser = require("browser-sync").create();
const htmlMinify = require("gulp-htmlmin");
const csso = require("postcss-csso");
const jsMinify = require("gulp-terser");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const sourcemap = require("gulp-sourcemaps");
const clean = require("gulp-clean");


//HTML

function html() {
  return gulp.src("source/*.html")
    .pipe(htmlMinify({collapseWhitespace: true}))
    .pipe(gulp.dest("build/"))
    .pipe(browser.stream())
}

exports.html = html;

// Styles
function styles() {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

exports.styles = styles;

//Script

function script() {
  return gulp.src("source/js/index.js")
    .pipe(plumber())
    .pipe(jsMinify())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("build/js"))
}

exports.script = script;

//WebP

function createWebp() {
  return gulp.src("source/img/**/*.{jpg,png,jpeg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

//Minify

function imageMinify() {
  return gulp.src("source/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"))
}

exports.imageMinify = imageMinify;

//Sprite

function sprite() {
  return gulp.src("source/img/vector/sprite-icons/*")
    .pipe(svgstore({
        inlineSvg: true
      }))
    .pipe(gulp.dest("build/img/vector/sprite-icons"))
}

exports.sprite = sprite;

// Server

function server(done) {
  browser.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

//Clean

function cleanD(done) {
  return gulp.src("build", {
      read: false,
      allowEmpty: true
    })
    .pipe(clean())
  done();
}

exports.cleanD = cleanD;

//Copy

function copy(done) {
  return gulp.src([
    "source/favicon.ico",
    "source/fonts/*",
    "source/img/**/*.{jpg,png,svg}",
    ], {
    base: "source"
  })
    .pipe(gulp.dest("build/"))
  done();
}

exports.copy = copy;

// Watcher

function watcher(done) {
  watch("source/sass/**/*.scss", gulp.series(styles));
  watch("source/*.html").on("change", browser.reload);
  done();
}

exports.watcher = watcher;

//Build

function build(done) {
  return gulp.series(
    cleanD,
    copy,
    imageMinify,
    gulp.parallel(
      html,
      styles,
      script,
      sprite,
      createWebp
  ))(done);
}

exports.build = build;

exports.default = gulp.series(
  cleanD,
  copy,
  gulp.parallel(
    html,
    styles,
    script,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
));
