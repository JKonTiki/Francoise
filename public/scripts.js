(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* jshint esversion: 6 */

// var testModule =  require('./../../general/scripts/test-module')
// use statements like this^^ for JS passing
"use strict";

},{}],2:[function(require,module,exports){
/* jshint esversion: 6 */

// var testModule =  require('./../../general/scripts/test-module')
// use statements like this^^ for JS passing
"use strict";

},{}],3:[function(require,module,exports){
'use strict';

/* jshint esversion: 6 */

// routing is based on page-wide div ID's of the format '#page-${page-name}'
// if those ID's are altered, update query selection format accordingly!

(function () {
  var routes = {
    // route values are the hash that will actually show in the URL
    home: {
      hash: '',
      divId: 'page-home'
    },
    error: {
      hash: 'error',
      divId: 'page-error'
    },
    about: {
      hash: 'about',
      divId: 'page-about'
    }
  };
  var hash = window.location.href.split("#").splice(1).join('');

  window.addEventListener('hashchange', function (event) {
    var newHash = event.newURL.split('#').splice(1).join('');
    renderRoute(newHash);
  }, false);

  function renderRoute(_hash) {
    // first we find page matching hash
    var activePage = void 0;
    for (var routeKey in routes) {
      if (routes[routeKey].hash === _hash) {
        activePage = document.querySelector('#' + routes[routeKey].divId);
        break;
      }
    }
    // clear all routes
    for (var _routeKey in routes) {
      var page = document.querySelector('#' + routes[_routeKey].divId);
      var pageClasses = page.classList.value.split(' ');
      if (!pageClasses.includes('hidden')) {
        page.classList.add('hidden');
      }
    }
    if (!activePage) {
      // if no page exists for that hash, show error page

      activePage = document.querySelector('#' + routes.error.divId);
    }
    // show hash's route if it not already shown
    var activePageClasses = activePage.classList.value.split(' ');
    if (activePageClasses.includes('hidden')) {
      activePage.classList.remove('hidden');
    }
  }
  //initial route render
  renderRoute(hash);
  // we hide static content until navigator is ready
  document.querySelector("body").classList.remove('hidden');
})();

},{}],4:[function(require,module,exports){
'use strict';

/* jshint esversion: 6 */

var exampleFunc = function exampleFunc() {
  console.log('hello-worldasdfasd');
};
var exampleVar = 'test';
exports.exampleVar = exampleVar;
exports.exampleFunc = exampleFunc;

},{}],5:[function(require,module,exports){
/* jshint esversion: 6 */

// var testModule =  require('./../../general/scripts/test-module')
// use statements like this^^ for JS passing
"use strict";

},{}],6:[function(require,module,exports){
/* jshint esversion: 6 */

// var testModule =  require('./../../general/scripts/test-module')
// use statements like this^^ for JS passing
"use strict";

},{}],7:[function(require,module,exports){
/* jshint esversion: 6 */

// var testModule =  require('./../../general/scripts/test-module')
// use statements like this^^ for JS passing
"use strict";

},{}]},{},[1,2,5,6,7,3,4])

//# sourceMappingURL=scripts.js.map
