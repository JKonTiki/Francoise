# Francoise

Francoise is a lightweight Gulp boilerplate for basic sing-page-applications. Aside from the templating engines it uses (SASS & Nunjucks) and its component-based architecture, it's generally unopinionated and can be a good jumping-off point for diving right into your code!

## Run

* Make sure you have both Node.js(http://nodejs.org) & Gulp(http://gulpjs.com) installed
* Download this project by running `git clone https://github.com/jkontiki/Francoise.git` from the command line or clicking [here](https://github.com/jkontiki/Francoise/master.zip)
* switch into the project directory `cd Francoise`
* run `npm install` to download dependencies
* launch project with `gulp` or compile for production with `gulp deploy`

## Features

Francoise uses [Nunjucks](https://github.com/mozilla/nunjucks), [SASS](http://sass-lang.com/), and [Browserify](http://browserify.org/) to compile modularizable HTML, CSS, and JavaScript respectively. The [build process](https://github.com/JKonTiki/Francoise/blob/master/gulpfile.js) also watches files for hot reloading, lints your JS, and uses sourcemaps for more accurate debugging.

### Architecture

I'm a big fan of breaking code up into components. By cohabitating a module's HTML, CSS, and JS, your code is unentagnled by design and easy to reuse elsewhere. The only difference between `component`s and `page`s is that the latter are meant to be routed through `app/general/scripts/navigator.js`, which uses a simple show/hide model based on a url-listener. The code in different components/pages should not interact (although that would not break anything), and common code should be kept in `app/general`.

Here's what our project will look like:

```
Francoise/
|—— app/
|   |—— assets/
|   |   |—— fonts/
|   |   |—— images/
|   |—— components/
|   |   |—— navbar-example/
|   |   |   |—— _styles.scss
|   |   |   |—— index.nunjucks
|   |   |   |—— scripts.js
|   |—— general/
|   |   |—— html/                  /* any common html should live here */
|   |   |   |—— index.nunjucks     /* this is our nunjucks index, @include all pages from here */
|   |   |   |—— layout.nunjucks    /* our header && footer */
|   |   |—— scripts/               /* any common JS should live here */
|   |   |   |—— navigator.js
|   |   |—— styles/
|   |   |   |—— abstracts/    /* SASS variables, utils, & other tools */
|   |   |   |—— base/         /* any common styling should live here */
|   |   |   |—— vendor/
|   |   |   |—— index.scss    /* our header && footer */
|   |—— pages/
|   |   |—— home-example/
|   |   |   |—— _styles.scss
|   |   |   |—— index.nunjucks
|   |   |   |—— scripts.js
|—— build/
|   |—— assets/
|   |   |—— fonts/
|   |   |—— images/    /* our build process will compress images */
|   |—— index.html
|   |—— scripts.js     /* this will be minified */
|   |—— styles.css     /* this will be minified */
|—— .gitignore
|—— gulpfile.js
|—— LICENSE
|—— package.json
|—— README.md
```

### Generating a New Component/Page

We can generate new components and pages from the CLI!

`gulp component -g new-component-name` will do just that, and we can delete with `gulp page -d deletable-page`. Some synonym flags work too, see flags variable in gulpfile.js. Create commands will build a component folder with its corresponding starter files, and it will also automatically import the new SASS code to our SASS index file (`app/general/styles/index.scss`). For new pages, Francoise will also set up your new render method in the navigator (`app/general/scripts/navigator.js`).

### Configuration

Although our build process is built with a somewhat specific architecture in mind, if you want to change up the folder structure you can totally do so - just adjust the paths specified at the top of the gulpfile.

## Credits

Thanks to [ryanbenson](https://github.com/ryanbenson/Harvest) for offering a boilerplate for my boilerplate and [cferdinandi](https://github.com/cferdinandi/gulp-boilerplate)'s project for good ideas. And much love to [this great person](https://www.youtube.com/watch?v=0M4LLlPA68o) for the inspiration!

This software is protected under the MIT license. Copyright (c) 2016 Jeremy Fryd.
