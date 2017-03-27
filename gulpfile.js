// get gulp dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence').use(gulp);
var shell = require('gulp-shell');
var plumber = require('gulp-plumber');
var babel = require("gulp-babel");
var jshint = require('gulp-jshint');
var nunjucksRender = require('gulp-nunjucks-render');

var autoPrefixBrowserList = [
  'last 2 version',
  'safari 5',
  'ie 8',
  'ie 9',
  'opera 12.1',
  'ios 6',
  'android 4'
];

var fileNames = {
  html: 'index.html',
  scripts: 'scripts.js',
  styles: 'styles.css',
};

var paths = {
  root: "app/",
  images: {
    origin:'app/assets/images/**',
    dest:'app/assets/images',
  },
  fonts: {
    origin:'app/assets/fonts/**',
    dest:'dist/assets/fonts',
  },
  scripts: {
    all:'app/**/*.js',
    index: 'app/' + fileNames.scripts,
  },
  styles: {
    main: 'app/general/styles/index.scss',
    all: ['app/**/*.scss', 'app/**/*.sass'],
    index: 'app/' + fileNames.styles,
  },
  html: {
    all: ['app/**.html','app/**/*.nunjucks'],
    main: 'app/general/html/index.nunjucks',
    index: 'app/' + fileNames.html,
  },
  dist: {
    root: 'dist/',
    scripts: 'dist/scripts',
    styles: 'dist/styles',
  },
};

var commands = {
  compile: {
    html: 'html',
    scripts: 'scripts',
    styles: 'styles',
  },
  deploy: {
    html: 'html-deploy',
    scripts: 'scripts-deploy',
    styles: 'styles-deploy',
    images: 'images-deploy',
    misc: 'misc-deploy',
    fonts: 'fonts-deploy',
    scaffold: 'scaffold',
  },
  browserSync: 'browserSync',
  clean: 'clean',
  htmlReload: 'html-reload',
  images: 'images',
  lint: 'lint',
};


// SCRIPTS
//compiling our Javascripts
gulp.task(commands.compile.scripts, function() {
    return gulp.src(paths.scripts.all)
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                // babel for language transpiling
                .pipe(babel())
                //this is the filename of the compressed version of our JS
                .pipe(concat(fileNames.scripts))
                //catch errors
                .on('error', gutil.log)
                //where we will store our finalized, compressed script
                .pipe(gulp.dest(paths.root))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});
//moving our Javascripts to deployment
gulp.task(commands.deploy.scripts, function() {
    //this is where our dev JS scripts are
    return gulp.src(paths.scripts.index)
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //compress :D
                .pipe(uglify())
                //where we will store our finalized, compressed script
                .pipe(gulp.dest(dist.scripts));
});

gulp.task(commands.lint, function(){
  return gulp.src(paths.scripts.all)
    //prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber())
    // linting!
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});


// STYLES
//compiling our SCSS files
gulp.task(commands.compile.styles, function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src(paths.styles.main)
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
                }))
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat(fileNames.styles))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest(paths.root))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task(commands.deploy.styles, function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src(paths.styles.index)
                .pipe(plumber())
                // compress
                .pipe(minifyCSS())
                //where to save our final, compressed css file
                .pipe(gulp.dest(dist.styles));
});


// HTML
//basically just keeping an eye on all HTML files
gulp.task(commands.htmlReload, function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src(paths.html.all)
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

gulp.task(commands.compile.html, function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src(paths.html.main)
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: [paths.root]
    }))
  // output files in app folder
  .pipe(gulp.dest(paths.root))
});

//migrating over all HTML files for deployment
gulp.task(commands.deploy.html, function() {
    //grab html index file
    gulp.src(paths.html.index)
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.root));
});


// ASSETS & MISC
//compressing images & handle SVG files
gulp.task(commands.images, function(tmp) {
    gulp.src(paths.images.origin)
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.images.dest));
});

//compressing images & handle SVG files
gulp.task(commands.deploy.images, function() {
    gulp.src(paths.images.origin)
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.dest));
});

// fonts
gulp.task(commands.deploy.fonts, function() {
    gulp.src(paths.fonts.origin)
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest));
});

//misc files for deploy
gulp.task(commands.deploy.misc, function() {
    gulp.src([paths.root + '*', !(paths.html.index), !(paths.scripts.index), !(paths.styles.index)])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.root));

    //grab any hidden files too
    gulp.src(paths.root + '.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(paths.dist.root));
});


// GENERAL
//cleans our dist directory in case things got deleted
gulp.task(commands.clean, function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task(commands.deploy.scaffold, function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/assets/fonts',
      'mkdir dist/assets/images',
      'mkdir dist/scripts',
      'mkdir dist/styles'
    ]
  );
});

gulp.task(commands.browserSync, function() {
    browserSync({
        server: {
            baseDir: paths.root
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});


//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default',
  [
    commands.browserSync,
    commands.lint,
    commands.compile.html,
    commands.compile.scripts,
    commands.compile.styles
  ], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch(paths.scripts.all, [commands.compile.scripts]);
    gulp.watch(paths.styles.all, [commands.compile.styles]);
    gulp.watch(paths.images.origin, [commands.images]);
    gulp.watch(paths.html.all, [commands.compile.html, commands.htmlReload]);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence(
  commands.clean,
  commands.deploy.scaffold,
  commands.compile.html,
  commands.compile.scripts,
  commands.compile.styles,
  [
    commands.deploy.scripts,
    commands.deploy.styles,
    commands.deploy.images,
    commands.deploy.fonts,
    commands.deploy.html,
    commands.deploy.misc,
  ]
));
