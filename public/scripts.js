(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__filename,__dirname){
"use strict";

/* jshint esversion: 6 */

exports.mount = function () {
  console.log("mounting at " + __filename.split(__dirname)[1]);
};

}).call(this,"/public/components/navbar/navbar-scripts.js","/public/components/navbar")

},{}],2:[function(require,module,exports){
(function (__filename,__dirname){
"use strict";

/* jshint esversion: 6 */

exports.mount = function () {
  console.log("mounting at " + __filename.split(__dirname)[1]);
};

}).call(this,"/public/components/welcome-message/welcome-message-scripts.js","/public/components/welcome-message")

},{}],3:[function(require,module,exports){
'use strict';

/* jshint esversion: 6 */

// client routing is based on page-wide div ID's of the format '#page-${page-name}'
// if those ID's are altered, update query selection format accordingly!

(function () {
  var imports = {
    home_js: require('./../../pages/home/home-scripts'),
    error_js: require('./../../pages/error/error-scripts'),
    about_js: require('./../../pages/about/about-scripts')
  };
  var pages = {
    home: {
      hash: '',
      divId: 'page-home',
      js: imports.home_js
    },
    error: {
      hash: 'error',
      divId: 'page-error',
      js: imports.error_js
    },
    about: {
      hash: 'about',
      divId: 'page-about',
      js: imports.about_js
    }
  };
  var hash = window.location.href.split("#").splice(1).join('');
  window.addEventListener('hashchange', function (event) {
    var newHash = event.newURL.split('#').splice(1).join('');
    renderPage(newHash);
  }, false);

  function renderPage(_hash) {
    // first we find page matching hash
    var activePage = void 0;
    var pageKey = void 0;
    for (var _pageKey in pages) {
      if (pages[_pageKey].hash === _hash) {
        activePage = document.querySelector('#' + pages[_pageKey].divId);
        pageKey = _pageKey;
        break;
      }
    }
    // clear all pages
    for (var _pageKey2 in pages) {
      var page = document.querySelector('#' + pages[_pageKey2].divId);
      var pageClasses = page.classList.value.split(' ');
      if (!pageClasses.includes('hidden')) {
        // if it exists, this is a good place to fire a page.js.unmount()
        page.classList.add('hidden');
      }
    }
    if (!activePage) {
      // if no page exists for that hash, show error page
      activePage = document.querySelector('#' + pages.error.divId);
      pageKey = 'error';
    }
    // show hash's page if it not already shown
    var activePageClasses = activePage.classList.value.split(' ');
    if (activePageClasses.includes('hidden')) {
      // mount js if page is setup for that
      var pageJs = pages[pageKey].js;
      if (pageJs.mount) {
        pageJs.mount();
      }
      activePage.classList.remove('hidden');
    }
  }
  //initial page render
  renderPage(hash);
  // we hide static content until navigator is ready
  document.querySelector("body").classList.remove('hidden');
})();

},{"./../../pages/about/about-scripts":4,"./../../pages/error/error-scripts":5,"./../../pages/home/home-scripts":6}],4:[function(require,module,exports){
(function (__filename,__dirname){
'use strict';

/* jshint esversion: 6 */

exports.mount = function () {
  console.log('mounting at ' + __filename.split(__dirname)[1]);
  // mounting our welcome-message component's JS
  require('./../../components/welcome-message/welcome-message-scripts').mount();
};

}).call(this,"/public/pages/about/about-scripts.js","/public/pages/about")

},{"./../../components/welcome-message/welcome-message-scripts":2}],5:[function(require,module,exports){
(function (__filename,__dirname){
"use strict";

/* jshint esversion: 6 */

exports.mount = function () {
  console.log("mounting at " + __filename.split(__dirname)[1]);
};

}).call(this,"/public/pages/error/error-scripts.js","/public/pages/error")

},{}],6:[function(require,module,exports){
(function (__filename,__dirname){
'use strict';

/* jshint esversion: 6 */

exports.mount = function () {
  console.log('mounting at ' + __filename.split(__dirname)[1]);
  // mounting our welcome-message component's JS
  require('./../../components/welcome-message/welcome-message-scripts').mount();
};

}).call(this,"/public/pages/home/home-scripts.js","/public/pages/home")

},{"./../../components/welcome-message/welcome-message-scripts":2}]},{},[1,2,4,5,6,3])

//# sourceMappingURL=scripts.js.map
