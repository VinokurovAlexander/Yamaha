"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemap = require("gulp-sourcemaps");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var del = require("del");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

gulp.task("html", function(){
  return gulp.src("src/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build"));
});
gulp.task("sprite", function() {
  return gulp.src([
    "src/img/icon-*.svg",
    "src/img/logo-*.svg",
  ])
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});
gulp.task("css", function() {
    return gulp.src("src/sass/style.scss")
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});
gulp.task("del-build", function() {
    return del("build");
});
gulp.task("server", function() {
    server.init ({
        server: "build/",
        ui: false,
        notify: false
    });

    gulp.watch("src/img/**/icon-*.svg"), gulp.series("sprite", "html", "refresh");
    gulp.watch("src/img/**/*.{jpg,png,svg}", gulp.series("copy", "refresh"));
    gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
    gulp.watch("src/*.html", gulp.series("html", "refresh"));
});
gulp.task ("refresh", function (done) {
    server.reload();
    done();
});
gulp.task("copy", function() {
    return gulp.src([
        "src/fonts/**/*.{woff,woff2}",
        "src/img/**",
        "src/js/**",
        "src/*.html"
    ], {
        base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("build", gulp.series("del-build", "copy", "css", "sprite", "html"));
gulp.task("start", gulp.series("build", "server"));
