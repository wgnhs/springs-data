import { RestylingCircleMarker } from './restyling-circle-marker.js';

export class SiteMap extends window.L.Evented {
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
      this._highlight.bringToFront()
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