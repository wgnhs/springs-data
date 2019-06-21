/* JAVASCRIPT */

/* ~~~~~~~~ Map ~~~~~~~~ */
//create a map, center it, and set the zoom level. 
//set zoomcontrol to false because we will add it in a different corner. 
var map = L.map('map', {zoomControl:false}).setView([45, -89.623861], 6);

/* ~~~~~~~~ Map Layers ~~~~~~~~ */
//basemap from Open Street Map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* ~~~~~~~~ Zoom Control ~~~~~~~~ */
//place a zoom control in the top right: 
new L.Control.Zoom({position: 'topright'}).addTo(map);

/* +++++++++++ Springs layer +++++++++++ */ 
var springs = L.esri.featureLayer({
    url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/1",
}).addTo(map);

var springPhotos = L.esri.featureLayer({
  url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/6"
});

var springSketches = L.esri.featureLayer({
  url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/4"
});

var popupTemplate = "<h3>{County} County Spring #{SpringID}</h3>";

springs.bindPopup(function(e){
    return L.Util.template(popupTemplate, e.feature.properties); 
});

var selectFeature = function(info) {
  var sidebar = document.querySelector('#sidebar');
  var details = document.querySelectorAll('site-details');
  details.forEach(function(el) {
    el['siteinfo'] = null;
    el['photos'] = null;
  });
  var siteSketch = document.querySelector('site-sketch');
  siteSketch['pdfsrc'] = null;


  springPhotos.query().where("Site_Code = '" + info['Site_Code'] + "'").run(function(err, col) {
    if (!err) {
      var photos = col.features.map( function(value, index) { return value.properties; } );
      photos.sort(function(a, b) {
        return a.Image_Number - b.Image_Number;
      });

      details.forEach(function(el) {
        el['siteinfo'] = info;
        el['photos'] = photos;
      });
      sidebar.switchTab('details');
    } else {
      console.log('Could not get Spring Photos', err);
    }
  });

  springSketches.query().where("File_Prefix = '" + info['Site_Code'] + "'").run(function(err, col) {
    if (!err) {
      var sketch = col.features.map( function(value, index) { return value.properties['FileURL']});
      siteSketch['pdfsrc'] = sketch[0];
    } else {
      console.log('Could not get Spring Sketches', err);
    }
  });
};

var deselectFeature = function() {
  var sidebar = document.querySelector('#sidebar');
  var details = document.querySelectorAll('site-details');
  details.forEach(function(el) {
    el['siteinfo'] = null;
    el['photos'] = null;
  });
  var siteSketch = document.querySelector('site-sketch');
  siteSketch['pdfsrc'] = null;

  sidebar.switchTab('default');
}

springs.on('popupopen', function(e) {
  var info = e.propagatedFrom.feature.properties;
  router.pause()
  router.navigate(router.generate('view.site', {siteCode: info['Site_Code']}));
  router.resume();
  selectFeature(info);
});

springs.on('popupclose', function(e) {
  router.navigate('/');
  deselectFeature();
});

var router = new Navigo(window.location.origin + '/springs-data/');
router.on({
  '/view/:siteCode': {
    as: 'view.site',
    uses: function(params) {
      springs.once('load', function() {
        springs.eachFeature(function(obj, l) {
          if (obj.feature.properties['Site_Code'] === params['siteCode']) {
            obj.fire('click', null, true);
          }
        });
      });
    }
  }
})
.notFound(function() {
})
.resolve();

// Define what we want to collect
var springsAggrData = {
  'Site_Code': { data: [] },
  'Water_Temp_C': { data: [], max: undefined, min: undefined },
  'Conductivity_uS': { data: [], max: undefined, min: undefined },
  'pH': { data: [], max: undefined, min: undefined }
}

springs.on('load', function() {
  // Collect datasets and aggregates
  springs.eachFeature(function(obj, l) {
    for (let [key, aggr] of Object.entries(springsAggrData)) {
      let value = obj.feature.properties[key];
      aggr.data.push(value);
      if (value && 'number' === typeof value) {
        if (!aggr.max || aggr.max < value) {
          aggr.max = value;
        }
        if (!aggr.min || aggr.min > value) {
          aggr.min = value;
        }
      }
    }
  });

  // store in details element, for use in reports
  var details = document.querySelectorAll('site-details');
  details.forEach(function(el) {
    el['aggrData'] = springsAggrData;
  });
});

document.addEventListener('toggle-sketch', function(e) {
  var mapEl = document.querySelector('#map');
  if (!e.detail.closed) {
    mapEl.setAttribute('data-closed', true);
  } else {
    mapEl.removeAttribute('data-closed');
    map.invalidateSize();
  }
});