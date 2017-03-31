// get gulp dependencies
var argv = require('minimist')(process.argv.slice(2));
var exec = require('child-process-promise').exec;
var gulp = require('gulp');
var inject = require('gulp-inject-string');
var pathExists = require('path-exists');
var rename = require('gulp-rename');


var componentTask = function(argv, flags, paths){
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
    // check name for illegal characters
    if (!(/^[A-Za-z0-9\-\_]+$/.test(argv[createKeys[i]]))) {
      console.log(`${argv[createKeys[i]]} contains illegal characters - aborting`);
      return;
    }
    var name = argv[createKeys[i]];
    pathExists(`app/components/${name}`).then(exists =>{
      if (exists) {
        console.log(`component folder ${name} already exists!`);
      } else {
        createComponent(name, paths);
      }
    })
  }
  // loop through and delete relevant material
  for (var i = 0; i < deleteKeys.length; i++) {
    var name = argv[deleteKeys[i]];
    pathExists(`app/components/${name}`).then(exists =>{
      if (!exists) {
        console.log(`no component folder for "${name}" exists`);
      } else {
        deleteComponent(name, paths);
      }
    })
  }
}

var createComponent = function(name, paths){
  console.log(`creating component: ${name}`);
  var fldrPath = `app/components/${name}`;
  exec(`mkdir ${fldrPath}`);
  exec(`touch ${fldrPath}/${name}-index.njk`);
  exec(`touch ${fldrPath}/${name}-scripts.js`);
  exec(`touch ${fldrPath}/_${name}-styles.scss`);
  // below we are adding component's styleSheet to importation main scss index
  gulp.src(paths.styles.main)
    .pipe(inject.after('//!COMPONENTS!', `\n@import './../../components/${name}/_${name}-styles';`))
    .pipe(rename(`index.scss`))
    .pipe(gulp.dest(paths.styles.general));
  // add wrapping div to component's index.njk for styles
  gulp.src(`${fldrPath}/${name}-index.njk`)
    .pipe(inject.prepend(`<!--use this wrapper to keep everything within component!-->` +
      `\n<div class='component-${name} component'>\n`))
    .pipe(inject.append(`\n</div>`))
    .pipe(rename(`${name}-index.njk`))
    .pipe(gulp.dest(`${fldrPath}/`));
  // add wrapper to local SASS file for scoping
  gulp.src(`${fldrPath}/_${name}-styles.scss`)
    .pipe(inject.prepend(`// use this wrapper to preserve scope!\n#component-${name} {\n`))
    .pipe(inject.append(`\n}`))
    .pipe(rename(`_${name}-styles.scss`))
    .pipe(gulp.dest(`${fldrPath}/`));
  // add intro comment to js file
  gulp.src(`${fldrPath}/${name}-scripts.js`)
    .pipe(inject.prepend(`// var testModule =  require('./../../general/scripts/test-module')` +
      `\n// use statements like this^^ for JS passing\n\n`))
    .pipe(rename(`${name}-scripts.js`))
    .pipe(gulp.dest(`${fldrPath}/`));
}

var deleteComponent = function(name, paths){
  console.log(`removing component: ${name}`);
  var fldrPath = `app/components/${name}`;
  // remove entire component folder
  exec(`rm -rf ${fldrPath}`);
  // remove component's styleSheet importation from main scss index
  gulp.src(paths.styles.main)
  .pipe(inject.replace(`\n@import './../../components/${name}/_${name}-styles';`, ''))
  .pipe(rename('index.scss'))
  .pipe(gulp.dest(paths.styles.general));
}

var pageTask = function(argv, flags, fileNames, paths){
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
    // check name for illegal characters
    if (!(/^[A-Za-z0-9\-\_]+$/.test(argv[createKeys[i]]))) {
      console.log(`${argv[createKeys[i]]} contains illegal characters - aborting`);
      return;
    }
    var name = argv[createKeys[i]];
    pathExists(`app/pages/${name}`).then(exists =>{
      if (exists) {
        console.log(`page folder ${name} already exists!`);
      } else {
        console.log(`creating page: ${name}`);
        createPage(name, paths, fileNames);
      }
    })
  }
  // loop through and delete relevant material
  for (var i = 0; i < deleteKeys.length; i++) {
    var name = argv[deleteKeys[i]];
    if (name === "error" || name === "home") {
      console.log("cannot auto-delete 'error' or 'home' pages. see README to manually go through process, or run 'gulp clear-example from original project clone to remove content'.");
      return;
    }
    pathExists(`app/pages/${name}`).then(exists =>{
      if (!exists) {
        console.log(`no page folder for "${name}" exists`);
      } else {
        console.log(`removing page: ${name}`);
        deletePage(name, paths, fileNames);
      }
    })
  }
}

var createPage = function(name, paths, fileNames){
  var fldrPath = `app/pages/${name}`;
  exec(`mkdir ${fldrPath}`);
  exec(`touch ${fldrPath}/${name}-index.njk`);
  exec(`touch ${fldrPath}/${name}-scripts.js`);
  exec(`touch ${fldrPath}/_${name}-styles.scss`);
  // below we are adding page's styleSheet to importation main scss index
  gulp.src(paths.styles.main)
  .pipe(inject.after('//!PAGES!', `\n@import './../../pages/${name}/_${name}-styles';`))
  .pipe(rename('index.scss'))
  .pipe(gulp.dest(paths.styles.general));
  // add wrapping div to page's index.njk for navigator
  gulp.src(`${fldrPath}/${name}-index.njk`)
    .pipe(inject.prepend(`<!--use this wrapper to keep everything within page!-->` +
      `\n<div id='page-${name}' class='page'>\n`))
    .pipe(inject.append(`\n</div>`))
    .pipe(rename(`${name}-index.njk`))
    .pipe(gulp.dest(`${fldrPath}/`));
  // add our new route to navigator.js
  // replace hyphens with underscores for routing object's prop key
  var nameKey = name.replace(/-/g, "_");
  gulp.src(paths.scripts.navigator)
    .pipe(inject.before('//!ROUTES!',
    `\t${nameKey}: {` +
      `\n\t\t\thash: '${name}',` +
      `\n\t\t\tdivId: 'page-${name}',` +
    `\n\t\t},\n\t`))
    .pipe(rename(fileNames.navigator))
    .pipe(gulp.dest(paths.scripts.navigator.split(fileNames.navigator)[0]));
  // include new route in nunjucks index
  gulp.src(paths.html.main)
    .pipe(inject.after('<!--PAGES-->', `\n\t{% include './pages/${name}/${name}-index.njk' %}`))
    .pipe(rename("index.njk"))
    .pipe(gulp.dest(paths.html.main.split("index.njk")[0]));
  // add wrapper to local SASS file for scoping
  gulp.src(`${fldrPath}/_${name}-styles.scss`)
    .pipe(inject.prepend(`// use this wrapper to preserve scope!\n#page-${name} {\n`))
    .pipe(inject.append(`\n}`))
    .pipe(rename(`_${name}-styles.scss`))
    .pipe(gulp.dest(`${fldrPath}/`));
  // add intro comment to js file
  gulp.src(`${fldrPath}/${name}-scripts.js`)
    .pipe(inject.prepend(`// var testModule =  require('./../../general/scripts/test-module')` +
      `\n// use statements like this^^ for JS passing\n\n`))
    .pipe(rename(`${name}-scripts.js`))
    .pipe(gulp.dest(`${fldrPath}/`));
}

var deletePage = function(name, paths, fileNames){
  var fldrPath = `app/pages/${name}`;
  // remove entire page folder
  exec(`rm -rf ${fldrPath}`);
  // remove page's styleSheet importation from main scss index
  gulp.src(paths.styles.main)
  .pipe(inject.replace(`\n@import './../../pages/${name}/_${name}-styles';`, ''))
  .pipe(rename('index.scss'))
  .pipe(gulp.dest(paths.styles.general));
  // remove route to navigator.js
  var nameKey = name.replace(/-/g, "_");
  gulp.src(paths.scripts.navigator)
  .pipe(inject.replace(
    `\t${nameKey}: {` +
      `\n\t\t\thash: '${name}',` +
      `\n\t\t\tdivId: '${name}-page',` +
    `\n\t\t},\n\t`
    , ''))
  .pipe(rename(fileNames.navigator))
  .pipe(gulp.dest(paths.scripts.navigator.split(fileNames.navigator)[0]));
  // delete route html inclusion in nunjucks index
  gulp.src(paths.html.main)
  .pipe(inject.replace(`\n\t{% include './pages/${name}/${name}-index.njk' %}`, ''))
  .pipe(rename("index.njk"))
  .pipe(gulp.dest(paths.html.main.split("index.njk")[0]));
}

var cleanExApp = function(){
  console.log('this may take a moment');
    pathExists(`app/components/welcome-message`).then(exists =>{
    if (!exists) {
      console.log('this command is very sensitive, please only use on original clone!');
      return;
    }
    console.log('clearing components');
    exec('gulp component -d welcome-message').then(()=>{
      exec('gulp component -d navbar').then(()=>{
        console.log('clearing about page');
        exec('gulp page -d about').then(()=>{
          console.log('clearing interfaces');
          exec('rm app/general/styles/abstracts/_interfaces.scss').then(()=>{
            exec('touch app/general/styles/abstracts/_interfaces.scss').then(()=>{
              console.log('clearing general.scss');
              exec('rm app/general/styles/base/_general.scss').then(()=>{
                exec('touch app/general/styles/base/_general.scss').then(()=>{
                  var pageName = 'home';
                  var fldrPath = `app/pages/${pageName}`;
                  console.log('clearing home page content');
                  exec(`rm ${fldrPath}/_${pageName}-styles.scss`).then(()=>{
                    exec(`rm ${fldrPath}/${pageName}-index.njk`).then(()=>{
                      exec(`touch ${fldrPath}/${pageName}-index.njk`).then(()=>{
                        exec(`touch ${fldrPath}/_${pageName}-styles.scss`).then(()=>{
                          pageName = 'error';
                          fldrPath = `app/pages/${pageName}`;
                          console.log('clearing error page content');
                          exec(`rm ${fldrPath}/_${pageName}-styles.scss`).then(()=>{
                            exec(`rm ${fldrPath}/${pageName}-index.njk`).then(()=>{
                              exec(`touch ${fldrPath}/${pageName}-index.njk`).then(()=>{
                                exec(`touch ${fldrPath}/_${pageName}-styles.scss`).then(()=>{
                                  gulp.src(paths.html.general + '/layout.njk')
                                    .pipe(inject.replace(`{% include "components/navbar/navbar-index.njk" %}`, ''))
                                    .pipe(rename('layout.njk'))
                                    .pipe(gulp.dest(paths.html.general));
                                  // include new route in nunjucks index
                                  gulp.src(`${fldrPath}/${pageName}-index.njk`)
                                    .pipe(inject.prepend(`<!--use this wrapper to keep everything within page!-->` +
                                      `\n<div id='page-${pageName}' class='page'>\n`))
                                    .pipe(inject.append(`\n</div>`))
                                    .pipe(rename(`${pageName}-index.njk`))
                                    .pipe(gulp.dest(`${fldrPath}/`));
                                  // add wrapper to local SASS file for scoping
                                  gulp.src(`${fldrPath}/_${pageName}-styles.scss`)
                                    .pipe(inject.prepend(`// use this wrapper to preserve scope!\n#page-${pageName} {\n`))
                                    .pipe(inject.append(`\n}`))
                                    .pipe(rename(`_${pageName}-styles.scss`))
                                    .pipe(gulp.dest(`${fldrPath}/`));
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  // how about that flying V, huh? DUCKS FLY TOGETHER!
}

exports.cleanExApp = cleanExApp;
exports.componentTask = componentTask;
exports.pageTask = pageTask;
