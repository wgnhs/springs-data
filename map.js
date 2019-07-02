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

var sat = L.esri.basemapLayer('Imagery');

/* ~~~~~~~~ Zoom Control ~~~~~~~~ */
//place a zoom control in the top right: 
new L.Control.Zoom({position: 'topright'}).addTo(map);

var basemapOptions = {
  'OpenStreetMap': osm,
  'Satellite': sat
}
L.control.layers(basemapOptions, null).addTo(map);

var colorRange = [
  '#e0ecf4',
  '#bfd3e6',
  '#9ebcda',
  '#8c96c6',
  '#8c6bb1',
  '#88419d',
  '#810f7c'
];
var calcRadius = (a) => Math.max(a/1.5,3);
var RestylingCircleMarker = L.CircleMarker.extend({ 
  getEvents: function() {
    return {
      zoomend: this._restyle,
      normalpoints: this._normal,
      typepoints: this._orifice,
      condpoints: this._conductivity,
      qpoints: this._discharge
    }
  },
  _restyle: function(e) {
    this.setRadius(calcRadius(e.target.getZoom()))
  },
  _normal: function(e) {
    this.setStyle({'color': '#3388ff'});
  },
  _orifice: function(e) {
    var color = '#3388ff';
    if (this.feature.properties.Orifice_Geom === 'seepage/filtration') {
      color = '#33AA44';
    }
    this.setStyle({'color': color});
  },
  _conductivity: function(e) {
    var color = colorRange[colorRange.length-1];
    var binWidth = (aggrData.aggr['Conductivity_uS'].max - aggrData.aggr['Conductivity_uS'].min) / colorRange.length;
    for (var i = 1; i < colorRange.length; i++) {
      if (((binWidth * i) + aggrData.aggr['Conductivity_uS'].min) > this.feature.properties['Conductivity_uS']) {
        color = colorRange[i];
        break;
      }
    }
    this.setStyle({'color': color});
  },
  _discharge: function(e) {
    var color = colorRange[colorRange.length-1];
    var binWidth = (aggrData.aggr['Discharge_cfs'].max - aggrData.aggr['Discharge_cfs'].min) / colorRange.length;
    for (var i = 1; i < colorRange.length; i++) {
      if (((binWidth * i) + aggrData.aggr['Discharge_cfs'].min) > this.feature.properties['Discharge_cfs']) {
        color = colorRange[i];
        break;
      }
    }
    this.setStyle({'color': color});
  },

});
/* +++++++++++ Springs layer +++++++++++ */ 
var springs = L.esri.featureLayer({
    url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/1",
    pointToLayer: function(geoJsonPoint, latlon) {
      var color = '#3388ff';
      return new RestylingCircleMarker(latlon, {
        weight: 2,
        color: color,
        radius: calcRadius(map.getZoom())
      });
    }
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
var aggrKeys = ['Site_Code', 'Conductivity_uS', 'Discharge_cfs', 'pH', 'Water_Temp_C'];
var aggrData = {
  aggr: {},
  data: []
};

springs.once('load', function() {
  // Collect datasets and aggregates
  springs.eachFeature(function(obj, l) {
    let result = {};
    aggrKeys.forEach(function(key) {
      result[key] = obj.feature.properties[key]
      if (!aggrData.aggr[key]) {
        aggrData.aggr[key] = {};
      }
      if (result[key] && 'number' === typeof result[key]) {
        if (!aggrData.aggr[key].max || aggrData.aggr[key].max < result[key]) {
          aggrData.aggr[key].max = result[key];
        }
        if (!aggrData.aggr[key].min || aggrData.aggr[key].min > result[key]) {
          aggrData.aggr[key].min = result[key];
        }
      }
    });
    aggrData.data.push(result);
  });

  // store in details element, for use in reports
  var details = document.querySelectorAll('site-details');
  details.forEach(function(el) {
    el['aggrData'] = aggrData;
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