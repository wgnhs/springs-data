import { SiteMap } from './map/site-map.js';
import { SiteData } from './site-data.js';
import { SiteRouter } from './site-router.js';

export { SiteDetails } from './details/site-details.js';
export { MapControls } from './map/map-controls.js';

window.siteMap = new SiteMap();
window.sidebar = document.querySelector('#sidebar');
window.pdfPanel = document.querySelector('#sketch');
window.pdfDownload = document.querySelector('#sketch-download');
window.details = document.querySelector('#details');
window.controls = document.querySelector('#controls');

window.details['pdfpanel'] = window.pdfPanel;

window.siteMap.once('init', function() {
  window.siteData = new SiteData(window.siteMap.springs, window.siteMap.springPhotos, window.siteMap.springSketches);
  window.details.alldata = window.siteData.aggrData.data;
  window.controls.alldata = window.siteData.aggrData.data;

  var deselectFeature = function() {
    window.details['siteinfo'] = null;
    window.details['photos'] = null;
    window.pdfDownload['file'] = null;
  }

  async function selectFeature(info) {
    deselectFeature();
    return Promise.all([
      window.siteData.lookupPhotos(info['Site_Code']).catch(()=>[]), 
      window.siteData.lookupSketches(info['Site_Code']).catch(()=>[])
    ]).then(function(resolved) {
      // console.log('loaded site photos and sketches');
      window.details['siteinfo'] = info;
      window.details['photos'] = resolved[0];
      if (resolved[1]) {
        window.details['pdfsrc'] = resolved[1][0];
        window.pdfDownload['file'] = resolved[1][0];
      }
    })
  };

  window.router = new SiteRouter();
  window.router.addRoute({
    name: 'entry',
    url: '/',
    onEnter: function(trans, state) {
      // console.log('route-entry');
      window.siteMap.clearSelection();
      deselectFeature();
      document.querySelector('#app').setAttribute('data-view', 'app');
      window.sidebar.switchTab('default');
      window.siteMap.setVisibility(true);
    },
    onExit: function(trans, state) {

    }
  });
  window.router.addRoute({
    name: 'view',
    url: '/view/:Site_Code',
    onEnter: function(trans, state) {
      // console.log('route-view');
      let params = trans.params();
      let attr = window.siteMap.selectPoint(params);
      if (attr) {
        window.details['printLayout'] = false;
        selectFeature(attr).then(() => {
          document.querySelector('#app').setAttribute('data-view', 'app');
          window.sidebar.switchTab('details');
          window.siteMap.setVisibility(true);
        })
      } else {
        window.router.clearRoute();
      }
    },
    onExit: function(trans, state) {
      window.pdfPanel.hide();
    }
  });
  window.router.addRoute({
    name: 'print',
    url: '/print/:Site_Code',
    onEnter: function(trans, state) {
      // console.log('route-print');
      let params = trans.params();
      let attr = window.siteMap.selectPoint(params);
      if (attr) {
        window.details['printLayout'] = true;
        selectFeature(attr).then(() => {
          document.querySelector('#app').removeAttribute('data-view');
          window.sidebar.switchTab('details');
          window.siteMap.setVisibility(false);
        })
      } else {
        window.router.clearRoute();
      }
    },
    onExit: function(trans, state) {

    }
  });
  window.router.onEnterAll({}, () => {
    document.querySelector('#spinner').setAttribute('data-closed', true);
  });
  window.router.start();

  window.siteMap.on('interaction', (params) => {
    if (params['Site_Code']) {
      window.router.setRoute('view', params);
    } else {
      window.router.clearRoute();
    }
  });
});

document.addEventListener('interaction', function(e) {
  const params = e.detail.params;
  if (params['Site_Code']) {
    window.router.setRoute('view', params);
  } else {
    window.router.clearRoute();
  }
});

document.addEventListener('clear-selection', function(e) {
  window.router.clearRoute();
});

document.addEventListener('toggle-print', function(e) {
  if (e.detail.on) {
    window.router.setRoute('print', e.detail.params);
  } else {
    window.router.setRoute('view', e.detail.params);
  }
});

document.addEventListener('toggle-pdf-panel', function(e) {
  window.siteMap.setVisibility(e.detail.closed);
});

document.addEventListener('stylepoints', function(e) {
  if (e.detail.type) {
    window.siteMap.updatePoints(e.detail.type + 'points');
  }
});