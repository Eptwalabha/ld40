var gulp = require('gulp');
var del = require('del');
// var ts = require('gulp-typescript');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var path = require('path');
var fs = require("fs");

var paths = {
    src: {
        ts: ['./app/ts/**/*.ts'],
        sass: ['./app/sass/**/*.scss'],
        json: ['./app/assets/json/**/*.json'],
        atlas: './app/assets/atlas',
        img: ['./app/assets/images/**/*'],
        fonts: ['./app/assets/fonts/**/*'],
        index: ['./app/index.html']
    },
    dst: {
        css: './app/css/',
        js: './app/js/',
        json: './dist/assets/json',
        atlas: './dist/assets/atlas',
        img: './dist/assets/images',
        fonts: './dist/assets/fonts'
    },
    tests: ['./tests/**/*.js']
};

gulp.task('atlas', gulp.series(_generateAtlas));
gulp.task('img', _copy("img"));
gulp.task('fonts', _copy("fonts"));
gulp.task('json', _copy("json"));
gulp.task('sass', gulp.series(_sass));
// gulp.task('useref', gulp.series('sass', 'fonts', 'json', 'img', 'atlas', _useref));
gulp.task('useref', _useref);
gulp.task('watch', gulp.series('sass', 'fonts', 'json', 'img', 'atlas', _watch));
// gulp.task('default', gulp.series('watch'));
gulp.task('default', gulp.series('sass', 'fonts', 'json', 'img', 'atlas', 'useref'));

function _watch (done) {
    // gulp.watch(paths.src.img, gulp.series('img', _useref));
    gulp.watch(paths.src.fonts, gulp.series('fonts'));
    gulp.watch(paths.src.json, gulp.series('json'));
    gulp.watch(paths.src.sass, gulp.series('sass'));
    // gulp.watch(paths.src.ts, gulp.series('atlas', _useref));
    done();
}

function _sass() {
    return gulp.src(paths.src.sass)
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest(paths.dst.css))
        .pipe(cleanCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(paths.dst.css));
}

function _useref() {
    return gulp.src(paths.src.index)
        .pipe(useref())
        .pipe(gulp.dest('dist'));
}

function _copyImages(done) {
    del(paths.dst.img)
        .then(function() {
            gulp.src(paths.src.img)
                .pipe(gulp.dest(paths.dst.img));
            done();
        });
}

function _copyFonts(done) {
    del(paths.dst.fonts)
        .then(function() {
            gulp.src(paths.src.fonts)
                .pipe(gulp.dest(paths.dst.fonts));
            done();
        });
}

function _copyMessages(done) {
    del(paths.dst.messages)
        .then(function() {
            gulp.src(paths.src.messages)
                .pipe(gulp.dest(paths.dst.messages));
            done();
        });
}

function _copy(type) {
    return function (done) {
        del(paths.dst[type])
            .then(function() {
                gulp.src(paths.src[type])
                    .pipe(gulp.dest(paths.dst[type]));
                done();
            });
    };
}

function _generateAtlas(done) {
    del(paths.dst.atlas)
        .then(function () {
            try {
                fs.mkdirSync(paths.dst.atlas);
            } catch (e) {
                console.log(paths.dst.atlas, "already created!");
            }
            fs.readdir(paths.src.atlas, {}, function (err, files) {
                var atlases = [];
                for (var i = 0; i < files.length; ++i) {
                    var file = path.format({
                        dir: paths.src.atlas,
                        base: files[i]
                    });
                    var info = fs.statSync(file);
                    if (info && info.isDirectory()) {
                        atlases.push({
                            name: files[i],
                            path: file
                        });
                    }
                }
                var cmds = [];
                for (i = 0; i < atlases.length; ++i) {
                    var cmd = 'spritesheet-js ' + atlases[i].path + '/* ' +
                        '--format pixi.js --trim --powerOfTwo --padding 1 ' +
                        '--path ' + paths.dst.atlas + ' --name ' + atlases[i].name;
                    cmds.push(cmd);
                }
                exec(cmds.join("; "), function (err) {
                    if (err) throw err;
                    console.info('spritesheet successfully generated');
                    done();
                });
            });
        });
}
