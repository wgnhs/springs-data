(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  const colorRange = [
    '#e0ecf4',
    '#bfd3e6',
    '#9ebcda',
    '#8c96c6',
    '#8c6bb1',
    '#88419d',
    '#810f7c'
  ];
  const calcRadius = (a) => Math.max(a/1.5,3);
  const RestylingCircleMarker = L.CircleMarker.extend({ 
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
      this.setRadius(calcRadius(e.target.getZoom()));
    },
    _normal: function(e) {
      let color = '#3388ff';
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    _orifice: function(e) {
      var color = '#3388ff';
      if (this.feature.properties.Orifice_Geom === 'seepage/filtration') {
        color = '#33AA44';
      }
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
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
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
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
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    highlight: function() {
      this._activeBackup = this.options.color;
      this.setStyle({'color': 'orange'});
    },
    removeHighlight: function() {
      if (this._activeBackup) {
        this.setStyle({'color': this._activeBackup});
        this._activeBackup = null;
      }
    }

  });

  class SiteMap extends window.L.Evented {
    constructor() {
      super();
      this.selected = false;

      /* ~~~~~~~~ Map ~~~~~~~~ */
      //create a map, center it, and set the zoom level. 
      //set zoomcontrol to false because we will add it in a different corner. 
      const map = this.map = L.map('map', {zoomControl:false}).setView([45, -89.623861], 6);
      this.el = document.querySelector('#map');
       
       /* ~~~~~~~~ Zoom Control ~~~~~~~~ */
      //place a zoom control in the top right: 
      new L.Control.Zoom({position: 'topright'}).addTo(map);

       
      /* ~~~~~~~~ Basemap Layers ~~~~~~~~ */
       
      // basemaps from Open Street Map
      const osmhot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors', 
         label: "OpenStreetMap Humanitarian"
      }).addTo(map);
       
       const osmmapnik =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', 
            label: "OpenStreetMap Mapnik"   
       }); 
      
      // Esri basemaps 
      const esrisat = L.esri.basemapLayer('Imagery', {label: "Esri Satellite"});
     
      const esritopo = L.esri.basemapLayer('Topographic', {label: "Esri Topographic"}); 
       
      // add the basemap control to the map  
      var basemaps = [osmhot, esrisat]; 
      map.addControl(L.control.basemaps({
         basemaps: basemaps, 
         tileX: 0, 
         tileY: 0, 
         tileZ: 1

      })); 


      /* +++++++++++ Springs layer +++++++++++ */ 
      this.springs = L.esri.featureLayer({
        url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/1",
        pointToLayer: function(geoJsonPoint, latlon) {
          let color = '#3388ff';
          return new RestylingCircleMarker(latlon, {
            weight: 2,
            radius: 4,
            color: color
          });
        }
      }).once('load', (function() {
        this.fire('init');
      }).bind(this)
      ).on('click', (function(e) {
        if (this._highlight !== e.propagatedFrom) {
          this.fire('interaction', e.propagatedFrom.feature.properties);
        } else {
          this.fire('interaction');
        }
      }).bind(this)
      ).addTo(map);

      this._highlight = null;

      /**
       * Set up data layers for querying
       */
      this.springPhotos = L.esri.featureLayer({
        url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/6"
      });
      this.springSketches = L.esri.featureLayer({
        url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/4"
      });
    }

    getPoint(site) {
      let result;
      this.springs.eachFeature(function(obj) {
        if (obj.feature.properties['Site_Code'] === site) {
          result = obj;
        }
      });
      return result;
    }

    zoomToPoint(site) {
      let point = this.getPoint(site);
      if (point) {
        this.map.setZoomAround(point.getLatLng(), 15);
      }
    }

    getHighlightPoint() {
      // console.log('retrieve highlight point');
      let result = this._highlight;
      return result;
    }

    setHighlightPoint(point) {
      if (point) {
        // console.log('set highlight point');
        this._highlight = point;
        this._highlight.bringToFront();
        this._highlight.highlight();
      } else {
        this.clearSelection();
      }
    }

    selectPoint(site) {
      // console.log('select point on map:', site);
      let point = this.getPoint(site);
      let highlightPoint = this.getHighlightPoint();
      if (point !== highlightPoint) {
        this.clearSelection();
        this.setHighlightPoint(point);
      }
      return point.feature.properties;
    }

    clearSelection() {
      // console.log('clear highlight group');
      if (this._highlight) {
        this._highlight.bringToBack();
        this._highlight.removeHighlight();
      }
      this._highlight = null;
    }

    setVisibility(isVisible) {
      if (isVisible) {
        this.el.removeAttribute('data-closed');
        this.map.invalidateSize();
      } else {
        this.el.setAttribute('data-closed', true);
      }
    }


  }

  class SiteData {
    constructor(springs, springPhotos, springSketches) {
      this._springPhotos = springPhotos;
      this._springSketches = springSketches;

      // Define aggregated data for visualization
      this._aggrKeys = ['Site_Code', 'Conductivity_uS', 'Discharge_cfs', 'pH', 'Water_Temp_C'];

      this.aggrData = SiteData._gatherAggrData(springs, this._aggrKeys);
    }

    async lookupPhotos(site) {
      const springPhotos = this._springPhotos;
      return new Promise(function(resolve, reject) {
        springPhotos.query().where("Site_Code = '" + site + "'").run(function(err, col) {
          if (!err) {
            var photos = col.features.map( function(value) { return value.properties; } );
            photos.sort(function(a, b) {
              return a.Image_Number - b.Image_Number;
            });

            resolve(photos);
          } else {
            // console.log('Could not get Spring Photos', err);
            reject(err);
          }
        });
      });
    }

    async lookupSketches(site) {
      const springSketches = this._springSketches;
      return new Promise(function(resolve, reject) {
        springSketches.query().where("File_Prefix = '" + site + "'").run(function(err, col) {
          if (!err) {
            var sketches = col.features.map( function(value, index) { return value.properties['FileURL']});
            resolve(sketches);
          } else {
            // console.log('Could not get Spring Sketches', err);
            reject(err);
          }
        });
      });
    }

    static _gatherAggrData(layer, aggrKeys) {
      const aggrData = {
        aggr: {},
        data: []
      };

      // Collect datasets and aggregates
      layer.eachFeature(function(obj, l) {
        let result = {};
        aggrKeys.forEach(function(key) {
          result[key] = obj.feature.properties[key];
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

      return aggrData;
    }
  }

  class SiteRouter extends window.L.Evented {

    constructor() {
      super();
      let router = this.router = new Navigo(window.location.origin + '/springs-data/');
      Object.entries(this.route).forEach(function(el) {
        if (el[1].signature) {
          router.on(el[1].signature, el[1].handler);
        } else {
          router.notFound(el[1].handler);
        }
      });
    }

    resolve() {
      this.router.resolve();
    }

    get route() {
      return {
        'entry': {
          handler: this._entryRoute.bind(this)
        },
        'view': {
          signature: '/view/:Site_Code',
          handler: this._viewSite.bind(this)
        },
        'print': {
          signature: '/print/:Site_Code',
          handler: this._printSite.bind(this)
        }
      };
    }

    _updateLocation(path) {
      this.router.pause();
      this.router.navigate(path);
      this.router.resume();
    }

    /**
     * Non-selected Site
     */
    _entryRoute() {
      this._updateLocation('/');
      this.fire('route-entry');
    }

    /**
     * Selected Site, View Layout
     */
    _viewSite(params) {
      if (params['Site_Code']) {
        this._updateLocation('/view/' + params['Site_Code']);
        this.fire('route-view', params);
      } else {
        console.error('bad viewSite call');
      }
    }

    /**
     * Selected Site, Print Layout
     */
    _printSite(params) {
      if (params['Site_Code']) {
        this._updateLocation('/print/' + params['Site_Code']);
        this.fire('route-print', params);
      } else {
        console.error('bad printSite call');
      }
    }

    /**
     * clear selection
     */
    clearRoute() {
      this.setRoute();
    }

    setRoute(name, params) {
      if (arguments.length > 0 && this.route[name]) {
        this.route[name].handler(params);
      } else {
        this._entryRoute();
      }
    }

  }

  window.siteMap = new SiteMap();
  window.sidebar = document.querySelector('#sidebar');

  window.siteMap.once('init', function() {
    window.siteData = new SiteData(window.siteMap.springs, window.siteMap.springPhotos, window.siteMap.springSketches);
    window.aggrData = siteData.aggrData;

    var deselectFeature = function() {
      document.dispatchEvent(new CustomEvent('toggle-sketch', {bubbles: true, detail: {closed: true}}));
      document.querySelectorAll('site-details').forEach(function(details) {
        details['siteinfo'] = null;
        details['photos'] = null;
      });
      document.querySelectorAll('site-sketch').forEach(function(sketch) {
        sketch['pdfsrc'] = null;
      });
    };

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
          });
        }
      })
    };

    window.router = new SiteRouter();
    window.router.on('route-entry', () => {
      // console.log('route-entry');
      window.siteMap.clearSelection();
      deselectFeature();
      document.querySelector('#app').setAttribute('data-view', 'app');
      window.sidebar.switchTab('default');
      window.siteMap.setVisibility(true);
    });
    window.router.on('route-view', (params) => {
      // console.log('route-view');
      let attr = window.siteMap.selectPoint(params['Site_Code']);
      document.querySelectorAll('site-details').forEach(function(details) {
        details['printLayout'] = false;
      });
      selectFeature(attr).then(() => {
        document.querySelector('#app').setAttribute('data-view', 'app');
        window.sidebar.switchTab('details');
        window.siteMap.setVisibility(true);
      });
    });
    window.router.on('route-print', (params) => {
      // console.log('route-print');
      let attr = window.siteMap.selectPoint(params['Site_Code']);
      document.querySelectorAll('site-details').forEach(function(details) {
        details['printLayout'] = true;
      });
      selectFeature(attr).then(() => {
        document.querySelector('#app').removeAttribute('data-view');
        window.sidebar.switchTab('details');
        window.siteMap.setVisibility(false);
      });
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
      window.router.setRoute('print', e.detail.params);
    } else {
      window.router.setRoute('view', e.detail.params);
    }
  });

  document.addEventListener('toggle-sketch', function(e) {
    window.siteMap.setVisibility(e.detail.closed);
  });


  document.addEventListener('stylepoints', function(e) {
    if (e.detail.type) {
      window.siteMap.map.fire(e.detail.type + 'points');
    }
  });

}));
