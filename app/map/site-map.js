import { RestylingCircleMarker } from './restyling-circle-marker.js';

export class SiteMap extends window.L.Evented {
  constructor() {
    super();
    this.selected = false;
    this._highlight = null;

    /* ~~~~~~~~ Map ~~~~~~~~ */
    //create a map, center it, and set the zoom level. 
    //set zoomcontrol to false because we will add it in a different corner. 
    const map = this.map = L.map('map', {zoomControl:false}).setView([45, -89.623861], 7);
    this.el = document.querySelector('#map');
     
     /* ~~~~~~~~ Zoom Control ~~~~~~~~ */
    //place a zoom control in the top right: 
    new L.Control.Zoom({position: 'topright'}).addTo(map);

     
    /* ~~~~~~~~ Basemap Layers ~~~~~~~~ */
     
    // basemaps from Open Street Map -- disable because some users cannot access .fr 
//     const osmhot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors', 
//        label: "OpenStreetMap Humanitarian"
//     }).addTo(map);
    

    
    // Esri basemaps 
    const esrisat = L.esri.basemapLayer('Imagery', {label: "Esri Satellite"});
   
    
    
    //Stamen basemap 
    const stamenterrain = new L.StamenTileLayer("terrain", {label: "Stamen Terrain", attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."});
  

    // add the basemap control to the map  
    var basemaps = [esrisat, stamenterrain]; 
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
        return new RestylingCircleMarker(latlon, {
          weight: 2,
          color: 'var(--map-symbol)',
          radius: RestylingCircleMarker.calcRadius(map.getZoom())
        });
      }
    }).on('click', (function(e) {
      if (this._highlight !== e.propagatedFrom) {
        this.fire('interaction', e.propagatedFrom.feature.properties);
      } else {
        this.fire('interaction');
      }
    }).bind(this));

    /**
     * Set up data layers for querying
     */
    this.springPhotos = L.esri.featureLayer({
      url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/6"
    });
    this.springSketches = L.esri.featureLayer({
      url: "https://data.wgnhs.wisc.edu/arcgis/rest/services/springs/springs_inventory/MapServer/4"
    });

    this.springs.once('load', () => {
      this.fire('init');
    });

    this.springs.addTo(map);
  }

  getPoint(params) {
    let result;
    this.springs.eachFeature(function(obj) {
      if (obj.feature.properties['Site_Code'] === params['Site_Code']) {
        result = obj;
      }
    });
    return result;
  }

  zoomToPoint(params) {
    let point = this.getPoint(params);
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
      this._highlight.bringToFront()
      this._highlight.highlight();
    } else {
      this.clearSelection();
    }
  }

  selectPoint(site) {
    let result = null;
    // console.log('select point on map:', site);
    let point = this.getPoint(site);
    if (point) {
      result = point.feature.properties;
      let highlightPoint = this.getHighlightPoint();
      if (point !== highlightPoint) {
        this.clearSelection();
        this.setHighlightPoint(point);
      }
    }
    return result;
  }

  clearSelection() {
    // console.log('clear highlight group');
    if (this._highlight) {
      this._highlight.bringToBack();
      this._highlight.removeHighlight();
    }
    this._highlight = null;
  }

  updatePoints(name) {
    this.map.fire(name);
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
