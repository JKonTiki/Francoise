/* jshint esversion: 6 */

// client routing is based on page-wide div ID's of the format '#page-${page-name}'
// if those ID's are altered, update query selection format accordingly!

(function(){
  let pages = {
    home: {
      hash: '',
      divId: 'page-home',
    },
		error: {
      hash: 'error',
      divId: 'page-error'
    },
		about: {
			hash: 'about',
			divId: 'page-about',
		},
	//!PAGES! (this comment is an important flag for gulpfile, DND!)
};
  let hash = window.location.href.split("#").splice(1).join('');

  window.addEventListener('hashchange', (event)=>{
    let newHash = event.newURL.split('#').splice(1).join('');
    renderPage(newHash);
  }, false);

  function renderPage(_hash) {
    // first we find page matching hash
    let activePage;
    for (let pageKey in pages){
      if (pages[pageKey].hash === _hash) {
        activePage = document.querySelector(`#${pages[pageKey].divId}`);
        break;
      }
    }
    // clear all pages
    for (let pageKey in pages){
      let page = document.querySelector(`#${pages[pageKey].divId}`);
      let pageClasses = page.classList.value.split(' ');
      if (!pageClasses.includes('hidden')) {
        page.classList.add('hidden');
      }
    }
    if (!activePage) {
      // if no page exists for that hash, show error page

      activePage = document.querySelector(`#${pages.error.divId}`);
    }
    // show hash's page if it not already shown
    let activePageClasses = activePage.classList.value.split(' ');
    if (activePageClasses.includes('hidden')) {
      activePage.classList.remove('hidden');
    }
  }
  //initial page render
  renderPage(hash);
  // we hide static content until navigator is ready
  document.querySelector("body").classList.remove('hidden');
}());
