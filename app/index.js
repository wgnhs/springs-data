import { SiteMap } from './site-map.js';
import { SiteData } from './site-data.js';
import { SiteRouter } from './site-router.js';

window.siteMap = new SiteMap();

window.siteMap.once('init', function() {
  window.siteData = new SiteData(window.siteMap.springs, window.siteMap.springPhotos, window.siteMap.springSketches);
  window.aggrData = siteData.aggrData;

  var deselectFeature = function() {
    document.querySelectorAll('site-details').forEach(function(details) {
      details['siteinfo'] = null;
      details['photos'] = null;
    });
    document.querySelectorAll('site-sketch').forEach(function(sketch) {
      sketch['pdfsrc'] = null;
    });
  }

  var selectFeature = function(info) {
    deselectFeature();
    return Promise.all([
      window.siteData.lookupPhotos(info['Site_Code']).catch(()=>[]), 
      window.siteData.lookupSketches(info['Site_Code']).catch(()=>[])
    ]).then(function(resolved) {
      // console.log('loaded site photos and sketches');
      document.querySelectorAll('site-details').forEach(function(details) {
        details['siteinfo'] = info;
        details['photos'] = resolved[0];
      });
      if (resolved[1]) {
        document.querySelectorAll('site-sketch').forEach(function(sketch) {
          sketch['pdfsrc'] = resolved[1][0];
        })
      }
    })
  };

  window.router = new SiteRouter();
  window.router.on('route-entry', () => {
    // console.log('route-entry');
    window.siteMap.clearSelection();
    deselectFeature();
    document.querySelector('#sidebar').switchTab('default');
  });
  window.router.on('route-view', (params) => {
    // console.log('route-view');
    let attr = window.siteMap.selectPoint(params['Site_Code']);
    selectFeature(attr).then(() => {
      document.querySelector('#sidebar').switchTab('details');
    })
  });
  window.router.on('route-print', (params) => {
    // console.log('route-print');
    let attr = window.siteMap.selectPoint(params['Site_Code']);
    selectFeature(attr).then(() => {
      document.querySelector('#sidebar').switchTab('details');
    })
  });
  window.router.resolve();

  window.siteMap.on('interaction', (params) => {
    if (params['Site_Code']) {
      window.router.setRoute('view', params);
    } else {
      window.router.clearRoute();
    }
  });
});
document.addEventListener('clear-selection', function(e) {
  window.router.clearRoute();
});


document.addEventListener('toggle-print', function(e) {
  if (e.detail.on) {
    console.log('TODO print on');
  } else {
    console.log('TODO print off');
  }
});

document.addEventListener('toggle-sketch', function(e) {
  window.siteMap.setVisibility(!e.detail.closed);
});


document.addEventListener('stylepoints', function(e) {
  if (e.detail.type) {
    window.siteMap.map.fire(e.detail.type + 'points');
  }
});