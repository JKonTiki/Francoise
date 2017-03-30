// routing is based on page-wide div ID's of the format '#page-${page-name}'
// if those ID's are altered, update query selection format accordingly!

(function(){
  let routes = {
    // route values are the hash that will actually show in the URL
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
	//!ROUTES! (this comment is an important flag for gulpfile, DND!)
  }
  let hash = window.location.href.split("#").splice(1).join('');

  window.addEventListener('hashchange', (event)=>{
    let newHash = event.newURL.split('#').splice(1).join('');
    renderRoute(newHash);
  }, false);

  function renderRoute(_hash) {
    // first we find page matching hash
    let activePage;
    for (let routeKey in routes){
      if (routes[routeKey].hash === _hash) {
        activePage = document.querySelector(`#${routes[routeKey].divId}`);
        break;
      }
    }
    // clear all routes
    for (let routeKey in routes){
      let page = document.querySelector(`#${routes[routeKey].divId}`);
      let pageClasses = page.classList.value.split(' ');
      if (!pageClasses.includes('hidden')) {
        page.classList.add('hidden');
      }
    }
    if (!activePage) {
      // if no page exists for that hash, show error page
      activePage = document.querySelector(`#${routes.error.divId}`);
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
