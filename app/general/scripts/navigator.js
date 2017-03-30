// routing is based on page-wide div ID's of the format '#page-${page-name}'
// if those ID's are altered, update query selection format accordingly!

(function(){
  let routes = {
    // route values are the hash that will actually show in the URL
    home: '',
	//!ROUTES! (this comment is an important flag for gulpfile, DND!)
  }
  let hash = window.location.hash;

  window.addEventListener('hashchange', (event)=>{
    let newHash = event.newURL.split('#').splice(1).join('');
    renderRoute(newHash);
  }, false);

  function renderRoute(_hash) {
    // first we find page matching hash
    let activePage;
    for (let route in routes){
      if (routes[route] === _hash) {
        activePage = document.querySelector('#page-' + route);
      }
      break;
    }
    // clear all routes
    for (let route in routes){
      let page = document.querySelector('#page-' + route);
      let pageClasses = page.classList.value.split(' ');
      if (!pageClasses.includes('hidden')) {
        page.classList.add('hidden');
      }
    }
    if (!activePage) {
      // if no page exists for that hash, show error page
      activePage = document.querySelector('#page-error');
    }
    // show hash's route if it not already shown
    let activePageClasses = activePage.classList.value.split(' ');
    if (activePageClasses.includes('hidden')) {
      activePage.classList.remove('hidden');
    }
  }
  //initial route render
  renderRoute(hash);
}());
