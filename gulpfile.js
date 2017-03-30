// get gulp dependencies
var argv = require('minimist')(process.argv.slice(2));
var autoprefixer = require('gulp-autoprefixer');
var babelify = require("babelify");
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var exec = require('child_process').exec;
var fs = require('fs');
var globby = require('globby');
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject-string');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var nunjucksRender = require('gulp-nunjucks-render');
var pathExists = require('path-exists');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourceMaps = require('gulp-sourcemaps');
var through = require('through2');
var uglify = require('gulp-uglify');

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
  navigator: 'navigator.js',
  scripts: 'scripts.js',
  styles: 'styles.css',
};

var flags = {
  create: ['c', 'create', 'g', 'generate'],
  delete: ['d', 'delete', 'r', 'remove'],
}

var paths = {
  root: "app/",
  images: {
    origin:'app/assets/images/*',
    dest:'build/assets/images/',
  },
  fonts: {
    origin:'app/assets/fonts/*',
    dest:'build/assets/fonts',
  },
  scripts: {
    all:['app/components/**/*.js', 'app/pages/**/*.js', 'app/general/scripts/*.js',],
    general: 'app/general/scripts/',
    index: 'app/' + fileNames.scripts,
    navigator: 'app/general/scripts/navigator.js',
  },
  styles: {
    all: ['app/**/*.scss', 'app/**/*.sass'],
    general: 'app/general/styles',
    index: 'app/' + fileNames.styles,
    main: 'app/general/styles/index.scss',
  },
  html: {
    all: ['app/pages/**/*.html', 'app/components/**/*.html','app/**/*.nunjucks'],
    index: 'app/' + fileNames.html,
    main: 'app/general/html/index.nunjucks',
  },
  build: {
    root: 'build/',
    scripts: 'build/',
    styles: 'build/',
  },
};

var commands = {
  compile: {
    html: 'html',
    scripts: 'scripts',
    styles: 'styles',
  },
  deploy: {
    fonts: 'fonts-deploy',
    images: 'images-deploy',
    html: 'html-deploy',
    misc: 'misc-deploy',
    scaffold: 'scaffold',
    scripts: 'scripts-deploy',
    styles: 'styles-deploy',
  },
  jsBrowserify: 'jsBrowserify',
  concatJs: 'concatJs',
  browserSync: 'browserSync',
  clean: 'clean',
  htmlReload: 'html-reload',
  images: 'images',
  lint: 'lint',
  component: 'component',
  page: 'page',
};


// SCRIPTS
//compiling our Javascripts
gulp.task(commands.compile.scripts, function() {
  // gulp expects tasks to return a stream, so we create one here.
 var bundledStream = through();
 bundledStream
   // turns the output bundle stream into a stream containing
   // the normal attributes gulp plugins expect.
   .pipe(source(fileNames.scripts))
   // the rest of the gulp task, as you would normally write it.
   .pipe(buffer())
   .pipe(sourceMaps.init({loadMaps: true}))
     // Add gulp plugins to the pipeline here.
     .on('error', gutil.log)
   .pipe(sourceMaps.write('./'))
   .pipe(gulp.dest(paths.root))
   .pipe(browserSync.reload({stream: true}));

 // "globby" replaces the normal "gulp.src" as Browserify
 // creates it's own readable stream.
 globby(paths.scripts.all).then(function(entries) {
   // create the Browserify instance.
   var b = browserify({
     entries: entries,
     debug: true,
   });

   // pipe the Browserify stream into the stream we created earlier
   // this starts our gulp pipeline.
   b
   .transform("babelify", {presets: ["es2015"]})
   .bundle()
   .pipe(bundledStream);

 }).catch(function(err) {
   // ensure any errors from globby are handled
   bundledStream.emit('error', err);
 });

 // finally, we return the stream, so gulp knows when this task is done.
 return bundledStream;
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
                .pipe(gulp.dest(paths.build.scripts));
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
                .pipe(gulp.dest(paths.build.styles));
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
        .pipe(gulp.dest(paths.build.root));
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


// GENERAL
//cleans our build directory in case things got deleted
gulp.task(commands.clean, function() {
  exec('rm -rf build');
  exec('rm ' + paths.html.index);
  exec('rm ' + paths.scripts.index);
  exec('rm ' + paths.styles.index);
  exec('rm ' + paths.scripts.index + '.map');
});

//create folders using shell
gulp.task(commands.deploy.scaffold, function() {
  exec('mkdir build');
  exec('mkdir build/assets');
  exec('mkdir build/assets/fonts');
  exec('mkdir build/assets/images');
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


// CREATE components and pages
// generate a component
gulp.task(commands.component, function(){
  var createKeys = [];
  var deleteKeys = [];
  // check flags to see if any are keys for a creation or deletion
  for (var loopingKey in argv) {
    if (flags.create.includes(loopingKey)) {
      createKeys.push(loopingKey);
    }
    if (flags.delete.includes(loopingKey)) {
      deleteKeys.push(loopingKey);
    }
  }
  // if no relevant keys exist, break
  if (createKeys.length < 1 && deleteKeys.length < 1) {
    return;
  }
  // loop through and conduct creations
  for (var i = 0; i < createKeys.length; i++) {
    var name = argv[createKeys[i]];
    pathExists('app/components/'+ name).then(exists =>{
      if (exists) {
        console.log('component folder "' + name + '" already exists!');
      } else {
        console.log('creating component: ', name);
        var fldrPath = 'app/components/' + name;
        exec('mkdir ' + fldrPath);
        exec('touch ' + fldrPath + '/index.nunjucks');
        exec('touch ' + fldrPath + '/scripts.js');
        exec('touch ' + fldrPath + '/_styles.scss');
        // below we are adding component's styleSheet to importation main scss index
        gulp.src(paths.styles.main)
        .pipe(inject.after('//!COMPONENTS!', `\n@import './../../components/${name}/_styles';`))
        .pipe(rename('index.scss'))
        .pipe(gulp.dest(paths.styles.general));
        // add wrapping div to component's index.nunjucks for styles
        gulp.src(fldrPath + '/index.nunjucks')
        .pipe(inject.prepend(`<div id='component-${name}' class="component">\n`))
        .pipe(inject.append(`\n</div>`))
        .pipe(rename('index.nunjucks'))
        .pipe(gulp.dest(fldrPath + '/'));
        // add wrapper to local SASS file for scoping
        gulp.src(fldrPath + '/_styles.scss')
        .pipe(inject.prepend(`#component-${name} {\n`))
        .pipe(inject.append(`\n}`))
        .pipe(rename('_styles.scss'))
        .pipe(gulp.dest(fldrPath + '/'));
      }
    })
  }
  for (var i = 0; i < deleteKeys.length; i++) {
    var name = argv[deleteKeys[i]];
    pathExists('app/components/'+ name).then(exists =>{
      if (!exists) {
        console.log('no component folder for "' + name + '" exists');
      } else {
        console.log('removing component: ', name);
        var fldrPath = 'app/components/' + name;
        // remove entire component folder
        exec('rm -rf ' + fldrPath);
        // remove component's styleSheet importation from main scss index
        gulp.src(paths.styles.main)
        .pipe(inject.replace(`\n@import './../../components/${name}/_styles';`, ''))
        .pipe(rename('index.scss'))
        .pipe(gulp.dest(paths.styles.general));
      }
    })
  }
});

//generate a page
gulp.task(commands.page, function(){
  var createKeys = [];
  var deleteKeys = [];
  // check flags to see if any are keys for a creation or deletion
  for (var loopingKey in argv) {
    if (flags.create.includes(loopingKey)) {
      createKeys.push(loopingKey);
    }
    if (flags.delete.includes(loopingKey)) {
      deleteKeys.push(loopingKey);
    }
  }
  // if no relevant keys exist, break
  if (createKeys.length < 1 && deleteKeys.length < 1) {
    return;
  }
  // loop through and conduct creations
  for (var i = 0; i < createKeys.length; i++) {
    var name = argv[createKeys[i]];
    pathExists('app/pages/'+ name).then(exists =>{
      if (exists) {
        console.log('page folder "' + name + '" already exists!');
      } else {
        console.log('creating page: ', name);
        var fldrPath = 'app/pages/' + name;
        exec('mkdir ' + fldrPath);
        exec('touch ' + fldrPath + '/index.nunjucks');
        exec('touch ' + fldrPath + '/scripts.js');
        exec('touch ' + fldrPath + '/_styles.scss');
        // below we are adding page's styleSheet to importation main scss index
        gulp.src(paths.styles.main)
        .pipe(inject.after('//!PAGES!', `\n@import './../../pages/${name}/_styles';`))
        .pipe(rename('index.scss'))
        .pipe(gulp.dest(paths.styles.general));
        // add wrapping div to page's index.nunjucks for navigator
        gulp.src(fldrPath + '/index.nunjucks')
        .pipe(inject.prepend(`<div id='page-${name}' class="page">\n`))
        .pipe(inject.append(`\n</div>`))
        .pipe(rename('index.nunjucks'))
        .pipe(gulp.dest(fldrPath + '/'));
        // add our new route to navigator.js
        gulp.src(paths.scripts.navigator)
        .pipe(inject.before('//!ROUTES!', `\t${name}: '${name}',\n\t`))
        .pipe(rename(fileNames.navigator))
        .pipe(gulp.dest(paths.scripts.navigator.split(fileNames.navigator)[0]));
        // include new route in nunjucks index
        gulp.src(paths.html.main)
        .pipe(inject.after('<!--PAGES-->', `\n\t{% include './pages/${name}/index.nunjucks' %}`))
        .pipe(rename("index.nunjucks"))
        .pipe(gulp.dest(paths.html.main.split("index.nunjucks")[0]));
        // add wrapper to local SASS file for scoping
        gulp.src(fldrPath + '/_styles.scss')
        .pipe(inject.prepend(`#page-${name} {\n`))
        .pipe(inject.append(`\n}`))
        .pipe(rename('_styles.scss'))
        .pipe(gulp.dest(fldrPath + '/'));
      }
    })
  }
  for (var i = 0; i < deleteKeys.length; i++) {
    var name = argv[deleteKeys[i]];
    pathExists('app/pages/'+ name).then(exists =>{
      if (!exists) {
        console.log('no page folder for "' + name + '" exists');
      } else {
        console.log('removing page: ', name);
        var fldrPath = 'app/pages/' + name;
        // remove entire page folder
        exec('rm -rf ' + fldrPath);
        // remove page's styleSheet importation from main scss index
        gulp.src(paths.styles.main)
        .pipe(inject.replace(`\n@import './../../pages/${name}/_styles';`, ''))
        .pipe(rename('index.scss'))
        .pipe(gulp.dest(paths.styles.general));
        // remove route to navigator.js
        gulp.src(paths.scripts.navigator)
        .pipe(inject.replace(`\t${name}: '${name}',\n\t`, ''))
        .pipe(rename(fileNames.navigator))
        .pipe(gulp.dest(paths.scripts.navigator.split(fileNames.navigator)[0]));
        // delete route html inclusion in nunjucks index
        gulp.src(paths.html.main)
        .pipe(inject.replace(`\n\t{% include './pages/${name}/index.nunjucks' %}`, ''))
        .pipe(rename("index.nunjucks"))
        .pipe(gulp.dest(paths.html.main.split("index.nunjucks")[0]));
      }
    })
  }
});

//this is our master task when you run `gulp` in CLI / Terminal
gulp.task('default',
  [
    commands.browserSync,
    commands.lint,
    commands.compile.html,
    commands.compile.scripts,
    commands.compile.styles,
  ], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch(paths.scripts.all, [commands.browserSync, commands.compile.scripts]);
    gulp.watch(paths.styles.all, [commands.browserSync, commands.compile.styles]);
    gulp.watch(paths.images.origin, [commands.browserSync, commands.images]);
    gulp.watch(paths.html.all, [commands.browserSync, commands.compile.html, commands.htmlReload]);
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
