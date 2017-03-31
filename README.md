# Francoise

Hey there, I'm a lightweight Gulp boilerplate for component-based sing-page-applications that live completely on the client. I try not to be overly opinionated, so if you'd like to just use me to write standard HTML, CSS, & JS, then _ma cherie_, I'm there for you.

At the very least, I offer simple/ergonomic build tools and a neat file structure that will make organizing your code _tellement facile_. At your disposal you'll also have SASS styling, Nunjucks templating, and a handy navigator for rendering through different pages.


_Je suis là, devant toi, toujours la même_


## Run

* Make sure you have both [Node.js](http://nodejs.org) & [Gulp](http://gulpjs.com) installed
* Download this project by running `git clone https://github.com/jkontiki/Francoise.git` from the command line or clicking [here](https://github.com/jkontiki/Francoise/master.zip)
* Switch into the project directory `cd Francoise`
* Run `npm install` to download dependencies
* Launch project from the command line with `gulp`

* To clear the example-app, run `gulp clear-example`. This is not yet perfectly tethered to the actual example-app, so be very careful with this one


## Features

I use [Nunjucks](https://github.com/mozilla/nunjucks), [SASS](http://sass-lang.com/), and [Browserify](http://browserify.org/) to compile modularizable HTML, CSS, and JavaScript respectively. The [build process](https://github.com/JKonTiki/Francoise/blob/master/gulpfile.js) also watches files for hot reloading, lints your JS, and uses SourceMaps for accurate debugging.

### Architecture

I'm a big fan of breaking code up into components. By cohabitating a module's HTML, CSS, and JS, your code is unentagnled by design and easy to reuse elsewhere. The only difference between a `component` and a `page` is that the latter are meant to be routed through `app/general/scripts/navigator.js`, which uses a simple show/hide model based on a url-listener. The idea is that code in different components/pages should not interact, with common code best being kept in `app/general`.

Here's what our project will look like:

```
Francoise/
|—— app/
|   |—— assets/
|   |   |—— fonts/
|   |   |—— images/
|   |—— components/                /* be sure to [import](https://github.com/mozilla/nunjucks) components to desired pages */
|   |   |—— navbar/
|   |   |   |—— _navbar-styles.scss
|   |   |   |—— navbar-index.njk
|   |   |   |—— navbar-scripts.js
|   |—— general/
|   |   |—— html/                  /* any common html should live here */
|   |   |   |—— index.njk          /* this is our nunjucks index, pages should be @include 'd from here */
|   |   |   |—— layout.njk         /* our header && footer */
|   |   |—— scripts/               /* any common JS should live here */
|   |   |   |—— navigator.js
|   |   |—— styles/
|   |   |   |—— abstracts/    /* good place SASS variables, interfaces, & other tools */
|   |   |   |—— base/         /* any app-wide styling should live here */
|   |   |   |—— vendor/
|   |   |   |—— index.scss    /* our SASS entry pt, all other files should be @import'd here */
|   |—— pages/
|   |   |—— home/
|   |   |   |—— _home-styles.scss
|   |   |   |—— home-index.njk
|   |   |   |—— home-scripts.js
|   |   |—— error/
|   |   |   |—— _error-styles.scss
|   |   |   |—— error-index.njk
|   |   |   |—— error-scripts.js
|—— build/             /* for production. use 'gulp deploy' to compile */
|   |—— assets/
|   |   |—— fonts/
|   |   |—— images/    /* build process will compress images */
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

`gulp component -g new-component-name` will do just that, and we can delete with `gulp page -d page-to-be-deleted`. Some synonym flags work too, see flags variable in gulpfile.js. If you'd like to tinker with this manually, here's the process that I go through:

New Pages & Components will:
* Generate folder with corresponding HTML, SASS, & JS indices
* Create wrappers, recommended for local scopage of new SASS & HTML code (JS can be required/imported node-style modules)
* Import new stylesheet^^ to our main SASS index at `app/general/styles/index.scss`

In addition, new Pages will:
* Add a new route to our navigator, corresponding to the aforementioned wrapper's ID
* Automatically adds new HTML to our Nunjucks index (do this manually for components). Our navigator hides all pages less the one actively routed to.

Deletions basically reverse engineer this process.

### Configuration

Although our build process is built with a somewhat specific architecture in mind, if you want to change up the folder structure you can totally do so - just adjust your paths at the top of the Gulpfile. Config component/page generation tasks specifically if you wish to adapt those as well.

See `app/general/scripts/navigator.js` for routing config.


## Credits

Thanks to [ryanbenson](https://github.com/ryanbenson/Harvest) for offering a boilerplate gulpfile for my boilerplate gulpfile and [cferdinandi](https://github.com/cferdinandi/gulp-boilerplate) for good ideas. More info about Francoise [here](https://www.youtube.com/watch?v=_V-b8QIYOpM).

This software is protected under the MIT license. Copyright (c) 2017 Jeremy Fryd.
