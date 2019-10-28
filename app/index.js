(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('wgnhs-router'), require('lit-element'), require('wgnhs-common'), require('wgnhs-styles'), require('wgnhs-layout')) :
  typeof define === 'function' && define.amd ? define(['exports', 'wgnhs-router', 'lit-element', 'wgnhs-common', 'wgnhs-styles', 'wgnhs-layout'], factory) :
  (global = global || self, factory(global.app = {}, global['wgnhs-router'], global['wgnhs-common'], global['wgnhs-common'], global['wgnhs-common'], global['wgnhs-layout']));
}(this, function (exports, wgnhsRouter, litElement, wgnhsCommon, wgnhsStyles, wgnhsLayout) { 'use strict';

  const colorRange = {

  'Conductivity_uS': [
       'var(--map-bin-blue-0)',
       'var(--map-bin-blue-1)',
       'var(--map-bin-blue-2)',
       'var(--map-bin-blue-3)',
       'var(--map-bin-blue-4)',
       'var(--map-bin-blue-5)',
       'var(--map-bin-blue-6)'
     ], 
  'Discharge_cfs': [
       'var(--map-bin-purple-0)',
       'var(--map-bin-purple-1)',
       'var(--map-bin-purple-2)',
       'var(--map-bin-purple-3)',
       'var(--map-bin-purple-4)',
       'var(--map-bin-purple-5)',
       'var(--map-bin-purple-6)'
     ], 
  'Water_Temp_C':[
       'var(--map-bin-green-0)',
       'var(--map-bin-green-1)',
       'var(--map-bin-green-2)',
       'var(--map-bin-green-3)',
       'var(--map-bin-green-4)',
       'var(--map-bin-green-5)',
       'var(--map-bin-green-6)'
     ], 
     'pH':  [
       'var(--map-bin-brown-0)',
       'var(--map-bin-brown-1)',
       'var(--map-bin-brown-2)',
       'var(--map-bin-brown-3)',
       'var(--map-bin-brown-4)',
       'var(--map-bin-brown-5)',
       'var(--map-bin-brown-6)'
     ]

  };

  const binRanges = {
    'Conductivity_uS': [
      [],
      [],
      [0, 300],
      [300, 502],
      [502, 676],
      [676, 926],
      [926, 2000]
    ],
    'Discharge_cfs': [
      [0.1, 0.2],
      [0.2, 0.5],
      [0.5, 1.0],
      [1, 2],
      [2, ],
      [2, 5],
      [5, 20]
    ], 
     'Water_Temp_C': [
      [5,6],
      [6,7],
      [7,8],
      [8, 9],
      [9, 10],
      [10, 13],
      [13, 17]
     ], 
     'pH':[
      [],
      [5.5, 6.5],
      [6.5, 7],
      [7, 7.5],
      [7.5, 8],
      [8, 9],
      [9, 10]
     ]
  };
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
      this.setRadius(RestylingCircleMarker.calcRadius(e.target.getZoom()));
    },
    _normal: function() {
      let color = 'var(--map-symbol)';
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    _orifice: function() {
      var color = 'var(--map-symbol)';
      var prop = 'Orifice_Geom';
      if (this.feature.properties[prop] === 'seepage/filtration') {
        color = 'var(--map-symbol-alt)';
      }
      if (!this._activeBackup) {
        this.setStyle({'color': color});
      } else {
        this._activeBackup = color;
      }
    },
    _conductivity: function() {
      var prop = 'Conductivity_uS';
      this._binPoint(prop);
    },
    _discharge: function() {
      var prop = 'Discharge_cfs';
      this._binPoint(prop);
    },
    _binPoint: function(prop) {
      let result = RestylingCircleMarker.binPoint(prop, this.feature.properties);
      if (!this._activeBackup) {
        this.setStyle({'color': result});
      } else {
        this._activeBackup = result;
      }
    },
    highlight: function() {
      this._activeBackup = this.options.color;
      this.setStyle({'color': 'var(--map-symbol-active'});
    },
    removeHighlight: function() {
      if (this._activeBackup) {
        this.setStyle({'color': this._activeBackup});
        this._activeBackup = null;
      }
    }
  });

  RestylingCircleMarker.calcRadius = (a) => Math.max(Math.floor(a/1.5),3);
  RestylingCircleMarker.binPoint = (prop, data) => {
    let result = "#406058";
    const ranges = binRanges[prop];
    if (ranges) {
      const val = data[prop];
      for (let i = 0; i < ranges.length; i++) {
        if (ranges[i] && val > ranges[i][0] && val <= ranges[i][1]) {
          result = colorRange[prop][i];
        }
      }
    }
    return result;
  };

  class SiteMap extends window.L.Evented {
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
       
      // basemaps from Open Street Map
      const osmhot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors', 
         label: "OpenStreetMap Humanitarian"
      }).addTo(map);

      // Esri basemaps 
      const esrisat = L.esri.basemapLayer('Imagery', {label: "Esri Satellite"});

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
        this._highlight.bringToFront();
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

  const formatDate = function formatDate(item) {
    return (!item) ?
      null :
      new Date(item).toISOString().substring(0,10);
  };

  const roundToTwoDecimals = function roundToTwoDecimals(item) {
    return (!item) ?
      null :
      item.toFixed(2);
  };

  const ignoredKeys = [
    'OBJECTID',
    'GlobalID',
    'File_Prefix',
    'Site_Code',
    'SpringID',
    'Surveyor',
    'Time',
    'County',
    'Horz_Precision_m',
    'Max_PDOP',
    'Access',
    'Ease_Access',
    'Notes',
    'gps_time_date',
    'sat_signals'
  ];
  const keyLookup = {
    'pH': { 'title': 'pH', 'desc': 'Measured as close to spring source as possible.' },
    'Conductivity_uS': { 'title': 'Conductivity (µS)', 'desc': 'Specific Conductance: Measured as close to spring source as possible (µmho/cm).' },
    'Water_Temp_C': { 'title': 'Temperature (°C)', 'desc': 'Measured as close to spring source as possible (°C).' },
    'SpringID': { 'title': 'Spring ID', 'desc': 'Unique identifier within county.' },
    'County': { 'title': 'County', 'desc': 'County where spring is located.' },
    'Surveyor': { 'title': 'Surveyor(s)', 'desc': 'Who conducted the survey (initials).' },
    'Date': { 'title': 'Date', 'desc': 'Date of field survey.', 'transform': formatDate },
    'Time': { 'title': 'Time', 'desc': 'Start time.' },
    'Easting_WTM': { 'title': 'Easting (WTM)', 'desc': 'Easting (WTM). As close to the spring source as possible.', 'transform': roundToTwoDecimals },
    'Northing_WTM': { 'title': 'Northing (WTM)', 'desc': 'Northing (WTM). As close to the spring source as possible.', 'transform': roundToTwoDecimals },
    'Horz_Precision_m': { 'title': 'Horizontal Precision (meters)', 'desc': 'Horizontal accuracy of GPS position (meters).' },
    'Max_PDOP': { 'title': 'Maximum PDOP', 'desc': 'Maximum positional dilution of precision (PDOP) during measurement.' },
    'Elevation_m': { 'title': 'Elevation (meters)', 'desc': 'From digital elevation model (DEM) (meters).', 'transform': roundToTwoDecimals },
    'elevation_source': { 'title': 'Elevation Source', 'desc': 'DEM source and horizontal resolution of DEM used to extract elevation.' },
    'Land_Owner': { 'title': 'Land Ownership', 'desc': 'List: state, county, city, NPS, USFS, tribal, military, private, other.' },
    'Access': { 'title': 'Access', 'desc': 'Directions to springs.' },
    'Ease_Access': { 'title': 'Ease of Access', 'desc': 'List: Easy access, Difficult access, Terrain prohibits access to other potential spring areas.' },
    'Land_Cover': { 'title': 'Land Cover', 'desc': 'List: urban, residential, agriculture, grassland, forest, open water, wetland, barren, shrubland, other.' },
    'Air_Temp_F': { 'title': 'Air Temperature (°F)', 'desc': 'Air temperature on date surveyed (°F).' },
    'Cloud_Cover_percent': { 'title': 'Cloud Cover (%)', 'desc': 'Cloud cover at time of survey (%).' },
    'Wind_Speed_mph': { 'title': 'Wind Speed (mph)', 'desc': 'Velocity measurement on date surveyed (mph).' },
    'Aspect_degrees': { 'title': 'Aspect', 'desc': 'Direction that the spring orifice faces.' },
    'Slope_degrees': { 'title': 'Slope (°)', 'desc': 'Channel slope (°).' },
    'Slope_Variability': { 'title': 'Slope Variability', 'desc': 'List: high, medium, low, none.' },
    'Condition': { 'title': 'Condition', 'desc': 'List: undisturbed, light, moderate, high.' },
    'Type_of_Disturbance': { 'title': 'Type of Disturbance', 'desc': 'List: wildlife, livestock, recreation, diversion, residence, impounded, dredging, flooding, trails, roadway, invasives, spring house, encased, raceways, human-made structure, trash, storm-water, drain tile, agriculture, other.' },
    'Spring_Area_sqm': { 'title': 'Spring Area (m²)', 'desc': 'List: <2 m², 2-10 m², 10-100 m², 100-1000 m², 1000-10,000 m², 10,000-100,000 m²' },
    'Surface_Types': { 'title': 'Surface Type(s)', 'desc': 'List: backwall, colluvial slope, sloping bedrock, pool, channel, spring mound, cave, other.' },
    'Width_ft': { 'title': 'Channel or Pool Width (feet)', 'desc': 'If a channel or pool exists, the mean width (feet).' },
    'Width_Location': { 'title': 'Width Location', 'desc': 'List: pool, channel, pond, spring house, other.' },
    'Depth_cm': { 'title': 'Channel or Pool Depth (cm)', 'desc': 'If a channel or pool exists, the mean depth (cm).' },
    'Depth_Location': { 'title': 'Depth Location', 'desc': 'List: pool, channel, pond, spring house, other.' },
    'Percent_organic': { 'title': 'Percent Organic', 'desc': 'Qualitative estimate of the % organics. Described as close to spring source as possible.' },
    'Percent_fines': { 'title': 'Percent Fines', 'desc': 'Qualitative estimate of the % fines. Described as close to spring source as possible.' },
    'Percent_sand': { 'title': 'Percent Sand', 'desc': 'Qualitative estimate of the % sand. Described as close to spring source as possible.' },
    'Percent_gravel': { 'title': 'Percent Gravel', 'desc': 'Qualitative estimate of the % gravel. Described as close to spring source as possible.' },
    'Percent_cobble': { 'title': 'Percent Cobble', 'desc': 'Qualitative estimate of the % cobble. Described as close to spring source as possible.' },
    'Percent_boulder': { 'title': 'Percent Boulder', 'desc': 'Qualitative estimate of the % boulder. Described as close to spring source as possible.' },
    'Percent_bedrock': { 'title': 'Percent Bedrock', 'desc': 'Qualitative estimate of the % bedrock. Described as close to spring source as possible.' },
    'Bedrock_Comp': { 'title': 'Bedrock Composition', 'desc': 'List: shale, siltstone, sandstone, conglomerate, limestone, dolomite, igneous or metamorphic, NA, other.' },
    'Spring_Type': { 'title': 'Spring Type', 'desc': 'List: helocrene, rheocrene, limnocrene, hillslope spring, cased, flowing well, other.' },
    'Spring_Source': { 'title': 'Spring Source', 'desc': 'List: single orifice, multiple orifices, diffuse flow, other.' },
    'Orifice_Geom': { 'title': 'Orifice Geomorphic Type', 'desc': 'List: seepage/filtration, fracture, tubular, contact.' },
    'Discharge_cfs': { 'title': 'Discharge (cfs)', 'desc': 'Spring flow (cfs).' },
    'Flow_Accuracy': { 'title': 'Flow Accuracy', 'desc': 'Level of accuracy of flow measurement, List: low, high' },
    'Discharge_Meas': { 'title': 'How Measured', 'desc': 'List: timed volume, float velocity method, flume, AA meter, AD meter (acoustic Doppler meter), EM meter (electromagnetic meter).' },
    'Flow_Location': { 'title': 'Flow Location', 'desc': 'Where flow was measured.' },
    'Flow_percent': { 'title': 'Flow %', 'desc': 'Percent of flow captured (%).' },
    'Veg_Bed_Cover_percent': { 'title': 'Vegetative Bed Cover (%)', 'desc': 'The proportion of the spring pool bed or channel bed that is covered by live vegetation (%).' },
    'Veg_Bank_Cover_percent': { 'title': 'Vegetative Bank Cover (%)', 'desc': 'The proportion of the spring pool banks or channel banks that is covered by live vegetation (%).' },
    'Notes': { 'title': 'Notes', 'desc': 'Other notes as necessary.' },
    'GlobalID': { 'title': 'Global ID', 'desc': 'Automatically generated unique and global ID' },
    'gps_time_date': { 'title': 'GPS time and date', 'desc': 'Automatically generated GPS time and date stamp' },
    'sat_signals': { 'title': 'Number of satellites', 'desc': 'Automatically generated number of satellites visible' }
  };

  class SiteBedMaterials extends litElement.LitElement{
      static get properties(){
          return {
              siteinfo: Object
          };
      }

      constructor() {
          super();
      }

      static get styles(){
          return litElement.css`
        :host {

        }
        text {
            font-size: var(--font-size-small);
            font-weight: bold;
            fill: #414c43;

        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .donutSegments {

        }
        .chartLabels {

        }
        .leaderLines {

        }
        `;
      }


      render() {

          return litElement.html `
        <div class="container">
        <!-- <h2>Spring-bed materials</h2> -->
        <svg id="bed-materials-chart"></svg>
        </div>
        `;

      }

      firstUpdated() {
          this.chart = d3.select(this.renderRoot.querySelector('#bed-materials-chart'));
      }

      updated() {

          var width = 500;
          var height = 300;
          var margin = 15; //space between the circle and the edge of the SVG
          var radius = (Math.min(width, height) / 2) - (margin * 2); //outer radius of the circle


          /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */

          this.chart.attr("width", width).attr("height", height);

          // set up groups within the svg:
          var masterGroup = this.chart.append("g").attr("transform", "translate("+width/2+","+height/2+")"); //append a group and move it to the center of the SVG.
          var donutGroup = masterGroup.append("g").attr("class", "donutSegments");
          var labelGroup = masterGroup.append("g").attr("class", "chartLabels");
          var linesGroup = masterGroup.append("g").attr("class", "leaderLines");


          /* ~~~~~~~~~ DATA ~~~~~~~~~ */

          var values = [
              {material: "organic", percent: this.siteinfo.Percent_organic, color: "#406058"},
              {material: "fines", percent: this.siteinfo.Percent_fines, color: "#adcaba"},
              {material: "sand", percent: this.siteinfo.Percent_sand, color: "#b7b098"},
              {material: "gravel", percent: this.siteinfo.Percent_gravel, color: "#cccccc"},
              {material: "cobble", percent: this.siteinfo.Percent_cobble, color: "#7b6888"},
              {material: "boulder", percent: this.siteinfo.Percent_boulder, color: "#514b47"},
              {material: "bedrock", percent: this.siteinfo.Percent_bedrock, color: "#98abc5"}
          ];

          //process the data array for use in the donut chart...
           var pie = d3.pie()
                      .sort(null)             // do not sort by size
                      .value(function(d){     // set the value that is used to size each pie chart segment
                          return d.percent    // the data attribute that gives the charted value for each segment
                      })(values);             // call this function, giving it the values array

          // the pie function returns an array of objects representing the segments, containing their the start and end angles, data value, etc.


          // the pie function always returns 7 objects. filter it down to only the objects with a percent value greater than zero, so we are not going to draw any 0-dimension paths.
          var filterpie = pie.filter(function(el){return el.value > 0;});

          //console.log("filtered pie is ", filterpie);

          /* ~~~~~~~~~ DONUT SEGMENTS ~~~~~~~~~ */
          // right now, the website is set up so that it re-renders everything in the side panel when a each spring is queried.
          // therefore, everything is cleared and re-generated with each query.
          // this code could be designed differently if more dynamic updating were required.


          //define the properties of a donut arc.
          var arc = d3.arc()
                      .outerRadius(radius)
                      .innerRadius(radius - 45)   //lower numbers here make a thinner ring
                      .padAngle(0.025);              //about 0.025 is a good visible gap.


          donutGroup.selectAll("path")                            // we are using all paths within the group
              .data(filterpie)                                          // we want to use the data as processed by the pie function. this returns the update selection, which includes all data values that have corresponding DOM elements.
              .enter()                                            // enter is a selection with placeholders for each data value (datum) that lacks a corresponding DOM element.
              .append("path")                                     // for any datum missing a DOM element, create one of these.
              .attr("d", arc)                                     //
              .attr("fill", function(d){return (d.data.color);})  // apply fill color, which is a function of the color data attribute.
              .style("opacity", 1)                                // apply any styles for the donut chart segments
              ;


          /* ~~~~~~~~~~ LABELS ~~~~~~~~~~~ */

           // calculates the angle for the middle of a slice
          function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

          // arc for positioning labels; won't be drawn.
          var outerArc = d3.arc()
                          .innerRadius(radius * 1.1)
                          .outerRadius(radius * 1.1);




          var label = this.chart.select(".chartLabels").selectAll("text")
              .data(filterpie)
              .enter()
              .append('text')
              .html(function(d){ return d.data.percent+"% "+d.data.material; })   // build the content of the label
              .attr('dy', '.35em')                                                //vertical alignment
              .attr("transform", function(d){

                      var anchorpoint = outerArc.centroid(d);                             // initially, set the anchorpoint of text to be where the bisecting angle meets the outer arc
                      anchorpoint[0] = radius * 1.15 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift the anchorpoint on the x axis.
                      // changes the point to be on left or right depending on where label is (multiply by 1 or by -1).

                      return 'translate('+anchorpoint+')';
              })
              .style('text-anchor', function(d){
                      // if slice centre is on the left, anchor text to start, otherwise anchor to end
                      return (midAngle(d)) < Math.PI ? 'start' : 'end';
              })
              ;


          /* ~~~~~~~~~ LEADER LINES ~~~~~~~~~ */
          var polyline = this.chart.select(".leaderLines").selectAll('polyline')
              .data(filterpie)
              .enter()
              .append('polyline')
              .attr('stroke', "#333333")      //set appearance
              .attr("stroke-width", 1)        //set appearance
              .style('fill', 'none')          //set appearance
              .attr('points', function(d){

                  // three points on each line:
                  // A: centroid of the donut segment
                  // B: where the bisecting angle meets the outer arc (breakpoint in the line)
                  // C: outer endpoint at the same y position as B, but with x coordinate near the side of the SVG

                  var endpoint = outerArc.centroid(d);                            // initially, set the endpoint (C) to point B.
                  endpoint[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);  // then shift point C on the x axis.

                  return [arc.centroid(d), outerArc.centroid(d), endpoint]        // return A, B, and C
              })
              ;

      } //close updated method.
  } //close export
  customElements.define('site-bed-materials', SiteBedMaterials);

  // https://github.com/wbkd/d3-extended
  d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
  d3.selection.prototype.moveToBack = function() {  
      return this.each(function() { 
          var firstChild = this.parentNode.firstChild; 
          if (firstChild) { 
              this.parentNode.insertBefore(this, firstChild); 
          } 
      });
  };

  const dischargeDotPlotOptions = {
    attributeKey: "Discharge_cfs",

    tickValues:[0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
    chartMin: 0,
    chartMax: 20,

    domain: [0, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0],
    labelFormat: ".1f", //show one number past the decimal point. 
  };

  const conductivityDotPlotOptions = {
    attributeKey: "Conductivity_uS",

    tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750],
    chartMin: 0,
    chartMax: 1750,

    domain: [0, 1750],
    labelFormat: "d", //show as integer (decimal notation)
  };

  const tempDotPlotOptions = {
    attributeKey: "Water_Temp_C",

    tickValues:[5,7,9,11,13,15,17],
    chartMin: 5,
    chartMax: 17,

    domain: [5, 17],
    labelFormat: "d", //show as integer (decimal notation)
  };

  const phDotPlotOptions = {
    attributeKey: "pH",

    tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
    chartMin: 5.5,
    chartMax: 10,

    domain: [5.5, 10],
    labelFormat: ".1f", //show one number past the decimal point.
  };


  class SiteWaterQuality extends litElement.LitElement {
    static get properties() {
      return {
          siteinfo: {
            type: Object,
            attribute: false
          },
          alldata: {
            type: Object,
            attribute: false
          }
      };
    }

    constructor() {
      super();
    }

    static get styles(){
      return litElement.css`
      .container {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
    `;
    }

    render() {
      return litElement.html`
      <div class="container">
        <dot-plot
          .options="${dischargeDotPlotOptions}"
          .annotated="${this.annotated}"
          .alldata="${this.alldata}"></dot-plot>
        <dot-plot
          .options="${conductivityDotPlotOptions}"
          .annotated="${this.annotated}"
          .alldata="${this.alldata}"></dot-plot>
        <dot-plot 
          .options="${tempDotPlotOptions}"
          .annotated="${this.annotated}"
          .alldata="${this.alldata}"></dot-plot>
        <dot-plot
          .options="${phDotPlotOptions}"
          .annotated="${this.annotated}"
          .alldata="${this.alldata}"></dot-plot>
      </div>
    `;
    } //end render

    get annotated() {
      return this.siteinfo['Site_Code'];
    }

  }   //end export class

  customElements.define('site-water-quality', SiteWaterQuality);

  class DotPlotElement extends litElement.LitElement {
    static get properties() {
      return {
        alldata: {
          type: Object,
          attribute: false
        },
        options: {
          type: Object,
          attribute: false
        },
        annotated: {
          type: String,
          attribute: false
        }
      };
    }

    constructor() {
      super();
    }

    static get styles(){
      return [
        ...wgnhsStyles.styles,
        litElement.css`
      .label{
          font-weight: bold;
      }
      .tick {
          font-size: 13px;

          color: #777;
      }
      .tick line {
          stroke: #777;
      }
      .annotation {
          font-size: 14px;
      }
      .annotated {
          stroke-width: 2; 
          stroke: #333; 
          opacity: 1; 
          fill: #000;
          r:5;
      }
      .highlighted {
          stroke-width: 2;
          stroke: #000;
          opacity: 1; 
          r:5;
      }
    `];
    }

    render() {
      return litElement.html`
      <svg></svg>
    `;
    }

    firstUpdated() {
      this.d3svg = d3.select(this.renderRoot.querySelector('svg'));
    }

    updated(prev) {
      if ((prev.has('alldata') || prev.has('options')) && this.options && this.alldata) {
        this.plot = new DotPlot(this.d3svg, this.options, this.alldata);
        this.plot.draw();
      }
      if (this.plot && prev.has('annotated') && this.annotated) {
        this.plot.annotate(this.annotated);
      }
    }
  }
  customElements.define('dot-plot', DotPlotElement);

  class DotPlot {
    constructor(d3svg, dotPlotOptions, alldata) {
      this.options = dotPlotOptions;
      this.svg = d3svg;
      this.allData = alldata;

      this.svgWidth = 400;
      this.svgHeight = 140;

      this.margin = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 20
      };

      this.chartWidth = this.svgWidth - this.margin.left - this.margin.right,
      this.chartHeight = this.svgHeight - this.margin.top - this.margin.bottom;
      this.tickPadding = 10; // spacing needed to see the ticks extend past the dots.
     }

     get x_scale() {
        
        //calculate the range values based on the domain values. If the domain has only two values, the range will be 0 and chartWidth. If there are more than two domain values, the chartWidth is evenly divided among them, creating a "polylinear" scale.  
        var setRange = []; 
        this.options.domain.forEach((e, i) => {
           setRange.push(this.chartWidth*i/(this.options.domain.length-1)); 
        });
        
        return d3.scaleLinear().domain(this.options.domain).range(setRange);
     }

     get y_scale() {
        return d3.scaleBand().domain([""]).rangeRound([0, this.chartHeight]);
     }

     draw(){
        var options = this.options;

        // console.log("draw dot plot ranging from "+options.chartMin+" to "+options.chartMax+" with the value "+options.siteInfo[options.attributeKey]+" annotated. ");


        this.svg.attr('width', this.svgWidth).attr("height", this.svgHeight);


        //append a group.
        var chartgroup = this.svg.append("g").attr("class", "chartgroup").attr("transform", "translate("+this.margin.left+", "+this.margin.top+")");

        /* ~~~~~~~~~ Draw the chart ~~~~~~~~~ */


        var xAxis = chartgroup.append("g").attr("class", "x-axis");
        xAxis
          .attr("transform", "translate(0," + this.chartHeight + ")")
          .call(
            d3
              .axisBottom(this.x_scale)
              .tickSizeInner(-this.chartHeight)
              .tickSizeOuter(0)
              .tickPadding(5)
              .tickValues(options.tickValues)
              .tickFormat(d3.format(this.options.labelFormat))
          )
          .call(g => g.select(".domain").remove());              // remove the horizontal line of the x axis. The horizontal line through the chart is a y axis tick.


        var yAxis = chartgroup.append("g").attr("class", "y-axis");    // the y axis will have one tick, which forms the horizontal line through the center of the chart.
        yAxis
          .call(
            d3
              .axisLeft(this.y_scale)
              .tickSizeInner(-this.chartWidth)
              .tickSizeOuter(0)
              .tickPadding(0)
          )
          .call(g => g.select(".domain").remove())           // no vertical line for the y axis (all vertical lines are x axis ticks)
          .call(g => g.selectAll("text").remove());          // no labels on y axis

       /* ~~~~~~~~~ create circles ~~~~~~~~~ */

       this.circles = chartgroup.append("g").attr("class", "circles");

       var jitterWidth = this.chartHeight-this.tickPadding;

        // within the circles group, append a (sub)group for each data point, and append to that (sub)group a circle. 
       var datapoint = this.circles.selectAll("g")
           .data(this.allData, (d) => { return d.Site_Code; })
           .enter()
           .append("g")
           .attr("class", "datapoint");
        
        
        var dot = datapoint.append("circle")
           .attr("cx", (d) => {return this.x_scale(d[options.attributeKey])})     // x position
           // Math.random() returns values from 0 to less than 1, in approximately uniform distribution.
           .attr("cy", (d) => {return this.chartHeight/2 - jitterWidth/2 + Math.random()*jitterWidth})     // y position
           .attr('r', 3)                                      // radius
           .attr("fill", (d) => { return RestylingCircleMarker.binPoint(options.attributeKey, d) })                           // fill color
           .attr("stroke", "#000")
           .attr("stroke-width", 0)
           .attr("opacity", "0.7")                           // opacity
           .attr("class", (d) => {
                    return d.Site_Code
                 })
           .on('click', (d) => {
                 console.log("switch to "+d['Site_Code']);
                 wgnhsCommon.dispatch(document, 'interaction', {params: d});
           })
           .on('mouseenter', (d) => {this.highlight(d['Site_Code']);})
           .on('mouseleave', (d) => {this.unhighlight(d['Site_Code']);})
        
           .append("svg:title")
           .text((d) => d['Site_Code'])
           ;

     } // END DRAW. draw is called once when on firstUpdated. 
     
     //annotate is called on update only. 
     annotate(siteCode) {
       
        var options = this.options;

        //select all groups within the circles group, then filter down to the one that matches the site code. 
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode)
           .moveToFront();
        
        var circle = g.select('circle')         
           .classed('annotated', true);          // add the annotation styling class to the circle. 


        var label = g.append("text")
           .attr('dy', '-0.75em') //vertical displacement
           .html((d) => { 
              return keyLookup[options.attributeKey]['title'] + ": "+d[options.attributeKey]
           });
        
        g.append("polyline")
           .attr('stroke', "#333333")      //set appearance
           .attr("stroke-width", 3)        //set appearance
           .style('fill', 'none')          //set appearance
           .attr('points', (d) => {
           
              // two points on each line:
               // A: top of the plot, vertically aligned with the dot
               // B: bottom of the plot, vertically aligned with the dot
               // each point is defined by an [x, y]
              var startpoint = [0,0];
                  startpoint[0] = circle.attr('cx');
                  startpoint[1] = 0;

              var endpoint = [0,0];
                  endpoint[0] = circle.attr('cx');
                  endpoint[1] = this.chartHeight;

               // console.log("start, end", startpoint, endpoint)
               return [startpoint, endpoint]        // return A, B
           
           })
           .moveToBack()  // move behind the dot (moves to the back of the group)
           ; // end append polyline

       
     } //end annotate 
     
     highlight(siteCode){
        
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode)
           .moveToFront();

           g.select('circle').classed('highlighted', true); 
        
     } // end highlight
     
     unhighlight(siteCode){
        var g = this.circles.selectAll("g")
           .filter((d) => d['Site_Code'] === siteCode);

           g.select('circle').classed('highlighted', false); 
        
     }  // end unhighlight 
     
  }

  class DownloadSection extends litElement.LitElement {
    static get properties() {
      return {
        file: {
          type: String
        }
      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
    a {
      text-decoration: none;
    }
    .download-button:hover {
      color: var(--palette-900);
    }
    .download-button:focus {
      outline: thin dotted;
    }
    .download-button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      cursor: pointer;
      text-align: center;
      background: var(--palette-white);
      color: var(--palette-accent);
      border: 1px solid var(--palette-light);
      border-radius: var(--border-radius);
      padding: var(--font-size);
      margin: var(--border-radius) 0;
    }
    .download-button > div {
      display: flex;
      align-items: center;
    }
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    `];
    }

    render() {
      return litElement.html`
    <a class="download-button" href="${this.file}" target="_blank" download>
      <div>
        <span>Download</span>
      </div>
      <div>
        <i class="icon material-icons" title="Download">save_alt</i>
      </div>
    </a>
    `;
    }
  }
  customElements.define('download-section', DownloadSection);

  const TOGGLE_EVENT = 'toggle-pdf-panel';

  class SiteSketchButton extends litElement.LitElement {
    static get properties() {
      return {
        src: {
          type: String
        },
        panel: {
          type: Object,
          attribute: false
        },
        closed: {
          type: Boolean,
          attribute: false
        }
      };
    }

    constructor() {
      super();
      this.closed=true;
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css``
      ];
    }

    render() {
      return litElement.html`
    <app-collapsible @open="${this.toggle}" button>
      <i slot="header-before" class="material-icons" title="Site sketch map">picture_as_pdf</i>
      <span slot="header">Site sketch map</span>
      <i slot="header-after" class="material-icons">${
          (!this.closed)?'chevron_left':'chevron_right'
        }</i>
    </app-collapsible>
    `;
    }

    updated(prev) {
      if ((prev.has('panel') || prev.has('src'))) {
        if (this.panel && this.src) {
          this.panel.request(this.src);
        }
      }
    }

    toggle(e) {
      if (!this.closed) {
        this.panel.hide();
      } else {
        this.panel.show(this.src);
      }
    }

    handleAlt(e) {
      if (e.detail.url === this.src) {
        this.closed = false;
      } else {
        this.closed = true;
      }
      this.requestUpdate();
    }

    connectedCallback() {
      super.connectedCallback();
      this.__altHandler = this.handleAlt.bind(this);
      document.addEventListener(TOGGLE_EVENT, this.__altHandler);
    }

    disconnectedCallback() {
      document.removeEventListener(TOGGLE_EVENT, this.__altHandler);
      super.disconnectedCallback();
    }
  }
  customElements.define('site-sketch-button', SiteSketchButton);

  /*!
    @license https://github.com/ciampo/macro-carousel/blob/master/LICENSE
    macro-carousel 1.0.0
  */
  !function(){let t;function getEvtListenerOptions(i){return !!function(){if(void 0===t){t=!1;try{const i=Object.defineProperty({},"passive",{get:()=>{t=!0;}});window.addEventListener("test",null,i);}catch(t){}}return t}()&&{passive:i}}function clamp(t,i=t,s=t){let e=t;if(i>s)throw new RangeError(`'min' ${i} should be lower than 'max' ${s}`);return t<i&&(e=i),t>s&&(e=s),e}function booleanSetter(t,i,s){s?t.setAttribute(i,""):t.removeAttribute(i);}function booleanGetter(t,i){return t.hasAttribute(i)}function intSetter(t,i,s){t.setAttribute(i,s);}function intGetter(t,i,s=0){const e=t.getAttribute(i);return null===e?s:parseInt(e,10)}function normalizeEvent(t){if("touchstart"===t.type||"touchmove"===t.type||"touchend"===t.type){const i=t.targetTouches[0]||t.changedTouches[0];return {x:i.clientX,y:i.clientY,id:i.identifier,event:t}}return {x:t.clientX,y:t.clientY,id:null,event:t}}const i=document.createElement("template");i.innerHTML='<style>:host{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;contain:content;-webkit-tap-highlight-color:rgba(0,0,0,0);--macro-carousel-gap:16px;--macro-carousel-background-color:transparent;--macro-carousel-slide-min-height:0px;--macro-carousel-slide-max-height:none;--macro-carousel-transition-duration:0.6s;--macro-carousel-transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94);--macro-carousel-pagination-gap:2px;--macro-carousel-pagination-height:44px;--macro-carousel-fallback-message-color-background:#fff;--macro-carousel__internal__slides-per-view:1}:host([hidden]){display:none}:host-context(.js-focus-visible) ::slotted(:focus:not(.focus-visible)),:host-context(.js-focus-visible) :focus:not(.focus-visible){outline:0}#externalWrapper{height:100%;overflow:hidden;contain:paint;background-color:var(--macro-carousel-background-color);-ms-touch-action:pan-y pinch-zoom;touch-action:pan-y pinch-zoom;cursor:-webkit-grab;cursor:grab}#externalWrapper:active{cursor:-webkit-grabbing;cursor:grabbing}:host([disable-drag]) #externalWrapper{cursor:default}#slidesWrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;height:100%;min-height:var(--macro-carousel-slide-min-height);max-height:var(--macro-carousel-slide-max-height);will-change:transform}:host([transitioning]) #slidesWrapper{-webkit-transition-property:-webkit-transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform;-webkit-transition-duration:var(--macro-carousel-transition-duration);transition-duration:var(--macro-carousel-transition-duration);-webkit-transition-timing-function:var(--macro-carousel-transition-timing-function);transition-timing-function:var(--macro-carousel-transition-timing-function)}#slidesWrapper ::slotted(*){-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0;-ms-flex-preferred-size:calc((100% - (var(--macro-carousel__internal__slides-per-view) - 1) * var(--macro-carousel-gap)) / var(--macro-carousel__internal__slides-per-view));flex-basis:calc((100% - (var(--macro-carousel__internal__slides-per-view) - 1) * var(--macro-carousel-gap)) / var(--macro-carousel__internal__slides-per-view));min-height:var(--macro-carousel-slide-min-height);max-height:var(--macro-carousel-slide-max-height);margin-right:var(--macro-carousel-gap);overflow:hidden;outline:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.slidesFallback{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:0;padding:.5em 1em;width:100%;background-color:var(--macro-carousel-fallback-message-color-background)}:host([disable-drag]) #slidesWrapper ::slotted(*){-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto}#pagination{display:none}:host([pagination]) #pagination{-ms-flex-item-align:center;align-self:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;height:var(--macro-carousel-pagination-height);contain:strict;font-size:0}div ::slotted(macro-carousel-pagination-indicator){margin:0 calc(var(--macro-carousel-pagination-gap) / 2);padding:0;font-size:inherit;opacity:.8}div ::slotted(macro-carousel-pagination-indicator.selected),div ::slotted(macro-carousel-pagination-indicator:hover){opacity:1}#navigation{display:none}:host([navigation]) #navigation{display:block}div ::slotted(macro-carousel-nav-button){position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}:host([pagination]) div ::slotted(macro-carousel-nav-button){top:calc(50% - var(--macro-carousel-pagination-height) / 2)}div ::slotted(.macro-carousel-previous){left:0}div ::slotted(.macro-carousel-next){right:0}#aria-live ::slotted(*){position:absolute;height:1px;width:1px;margin:-1px;padding:0;clip:rect(0 0 0 0);overflow:hidden;border:0}@media print{#slidesWrapper ::slotted(*){margin-right:0;margin-bottom:.2em;outline:1px solid #000;color:#000;page-break-inside:avoid}:host([navigation]) #navigation,:host([pagination]) #pagination{display:none}#slidesWrapper{display:block;-webkit-transform:none!important;transform:none!important;-webkit-transition:0s;transition:0s}}</style> <div id="externalWrapper"> <div id="slidesWrapper"> <slot id="slidesSlot"> <p class="slidesFallback">No content available</p> </slot> </div> </div> <div id="navigation"> <slot id="navigationSlot" name="navigationSlot"></slot> </div> <div id="pagination"> <slot id="paginationSlot" name="paginationSlot"></slot> </div> <div id="aria-live"> <slot id="ariaSlot" name="ariaSlot"></slot> </div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(i,"macro-carousel");const s=.5,e=2,o=Math.abs((a=35,Math.round(100*Math.tan(a*Math.PI/180))/100));var a;const n=5;window.customElements.define("macro-carousel",class MacroCarousel extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(i.content.cloneNode(!0)),this.t=this.shadowRoot.querySelector("#externalWrapper"),this.i=this.shadowRoot.querySelector("#slidesWrapper"),this.s=this.shadowRoot.querySelector("#slidesSlot"),this.e=this.shadowRoot.querySelector("#ariaSlot"),this.o=this.shadowRoot.querySelector("#paginationSlot"),this.a=[],this.n=this.shadowRoot.querySelector("#navigationSlot"),this.r=void 0,this.h=void 0,this.c=[],this.l=-1,this.d=!1,this.u=0,this.m=0,this.g=0,this.p=0,this.b=0,this.v=0,this.w=void 0,this.f=!1,this.k=!1,this._=void 0,this.S=void 0,this.z=void 0,this.M=void 0,this.C=void 0,this.W=void 0,this.P=void 0,this.L=void 0,this.G=[],this.F=!1,this.I=50,this.$=20,this.A=.7,this.D=.04,this.T=0,this.N=!1;}connectedCallback(){window.ShadyCSS&&window.ShadyCSS.styleElement(this),this.hasAttribute("role")||this.setAttribute("role","list"),this.j("selected"),this.j("loop"),this.j("navigation"),this.j("pagination"),this.j("disableDrag"),this.j("slidesPerView"),this.j("reducedMotion"),this.j("autoFocus"),this.m=this.selected,this.O(),this.s.addEventListener("slotchange",this),window.addEventListener("resize",this,getEvtListenerOptions(!0)),this.addEventListener("keydown",this),window.addEventListener("touchmove",function(){}),this.q();}disconnectedCallback(){this.s.removeEventListener("slotchange",this),window.removeEventListener("resize",this),this.disableDrag||(this.t.removeEventListener("touchstart",this),this.t.removeEventListener("mousedown",this)),this.navigation&&(this.r.removeEventListener("macro-carousel-nav-button-clicked",this),this.h.removeEventListener("macro-carousel-nav-button-clicked",this)),this.pagination&&this.a.forEach(t=>{t.removeEventListener("macro-carousel-pagination-indicator-clicked",this);});}handleEvent(t){"resize"===t.type&&t.target===window?(this.B(),this.update()):"slotchange"===t.type&&t.target===this.s?this.q():"macro-carousel-pagination-indicator-clicked"===t.type&&this.pagination?this.V(t):"macro-carousel-nav-button-clicked"===t.type&&this.navigation?t.target===this.r?this.previous():t.target===this.h&&this.next():"keydown"===t.type?37===t.keyCode||38===t.keyCode?this.previous():39!==t.keyCode&&40!==t.keyCode||this.next():"transitionend"===t.type&&t.target===this.i?(this.H(),this.R(),this.X()):"touchstart"===t.type||"mousedown"===t.type?this.Y(normalizeEvent(t)):"touchmove"===t.type||"mousemove"===t.type?this.U(normalizeEvent(t)):"touchend"===t.type||"mouseup"===t.type?this.J(normalizeEvent(t)):"touchcancel"===t.type&&this.K();}j(t){if(this.hasOwnProperty(t)){const i=this[t];delete this[t],this[t]=i;}}update(){clearTimeout(this.w),this.B(),this.w=setTimeout(()=>{this.Q();},50);}Q(){this.Z(),this.tt(),this.it(),this.st(this.c.map(t=>t.layoutIndex),!0),this.et(this.selected),this.ot(),this.at(),this.nt(),this.H(),this.X(),this.O();}previous(){this.selected=this.rt(this.selected);}rt(t){let i=t;return t>0?i=t-1:this.loop&&(this.d&&(this.u-=1),i=this.l),clamp(i,0,this.l)}next(){this.selected=this.ht(this.selected);}ht(t){let i=t;return t<this.l?i=t+1:this.loop&&(this.d&&(this.u+=1),i=0),clamp(i,0,this.l)}static get observedAttributes(){return ["selected","loop","navigation","pagination","disable-drag","slides-per-view","reduced-motion","auto-focus"]}attributeChangedCallback(t,i,s){switch(0===this.c.length&&this.q(),t){case"selected":const e=parseInt(s,10);if(!Number.isFinite(e)||e>this.l||e<0)return void(this.selected=i||0);if(this.d){const t=this.selected+this.u*(this.l+1),i=this.m-t,s=[],e=i<0?this.slidesPerView+i:0;for(let o=-1;o<Math.abs(i);o++)s.push(o+t+e);this.st(s),this.m=t;}this.et(this.selected),this.ot(),this.at(),this.dispatchEvent(new CustomEvent("macro-carousel-selected-changed",{detail:this.selected,bubbles:!0})),this.f||this.N||(this.H(),this.R(),this.X());break;case"loop":this.tt(),this.it(),this.st(this.c.map((t,i)=>i)),this.at(),this.ot(),this.H(),this.R(),this.X(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"navigation":this.update(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"pagination":this.ot(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"disable-drag":this.nt();break;case"slides-per-view":const o=parseInt(s,10);if(!Number.isFinite(o)||o<1||o>this.c.length)return void(this.slidesPerView=i||1);this.update(),window.ShadyCSS&&window.ShadyCSS.styleSubtree(this);break;case"reduced-motion":null!==s?this.B():this.O();}}set selected(t){intSetter(this,"selected",t);}get selected(){return intGetter(this,"selected")}set loop(t){booleanSetter(this,"loop",t);}get loop(){return booleanGetter(this,"loop")}set navigation(t){booleanSetter(this,"navigation",t);}get navigation(){return booleanGetter(this,"navigation")}set pagination(t){booleanSetter(this,"pagination",t);}get pagination(){return booleanGetter(this,"pagination")}set disableDrag(t){booleanSetter(this,"disable-drag",t);}get disableDrag(){return booleanGetter(this,"disable-drag")}set slidesPerView(t){intSetter(this,"slides-per-view",t);}get slidesPerView(){return intGetter(this,"slides-per-view",1)}set reducedMotion(t){booleanSetter(this,"reduced-motion",t);}get reducedMotion(){return booleanGetter(this,"reduced-motion")}set autoFocus(t){booleanSetter(this,"auto-focus",t);}get autoFocus(){return booleanGetter(this,"auto-focus")}B(){this.f=!1,this.removeAttribute("transitioning"),this.i.removeEventListener("transitionend",this,!1);}O(){this.reducedMotion||requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.f=!0,this.setAttribute("transitioning",""),this.i.addEventListener("transitionend",this,!1);});});}Z(){this.g=this.i.getBoundingClientRect().width,this.p=this.ct(),this.b=this.lt();}lt(){return (this.g-(this.slidesPerView-1)*this.p)/this.slidesPerView}ct(){/\d$/.test(function(t,i){const s=getComputedStyle(t);return String(s.getPropertyValue(i)).trim()}(this,"--macro-carousel-gap"))&&console.warn("Warning: it looks like --macro-carousel-gap has a unitless value.\nAdd CSS units to its value to avoid breaking the slides layout.");const t=parseInt(getComputedStyle(this.c[0].element)["margin-right"],10);return Number.isFinite(t)?t:0}it(){var t,i,s;t=this,i="--macro-carousel__internal__slides-per-view",s=`${this.slidesPerView}`,t.style.setProperty(i,s),window.ShadyCSS&&window.ShadyCSS.styleSubtree(t,{[i]:s}),this.l=this.d?this.c.length-1:this.dt(),!this.d&&this.selected>this.l&&(this.selected=this.l);}dt(){return Math.max(0,this.c.length-this.slidesPerView)}ut(t){let i=t;for(;i<0;)i+=this.c.length;return i%this.c.length}st(t,i=!1){let s;t.forEach(t=>{!i&&this.c.find(i=>i.layoutIndex===t)||(s=this.ut(t),this.c[s].layoutIndex=t,this.c[s].position=this.mt(t),this.c[s].element.style.transform=`translateX(${this.mt(s-t)}px)`);});}mt(t){return -t*(this.b+this.p)}gt(t){this.i.style.transform=`translate3d(${t}px, 0, 0)`,this.v=t;}et(t){this.i&&!this.N&&this.gt(this.c[t].position);}R(){this.autoFocus&&this.c[this.selected].element.focus();}H(){const t=[];for(let i=0;i<this.slidesPerView;i++)t.push((this.selected+i)%this.c.length);let i;this.c.map(t=>t.element).forEach((s,e)=>{i=void 0!==t.find(t=>t===e),s.setAttribute("aria-hidden",i?"false":"true"),i?(s.removeAttribute("inert"),s.setAttribute("tabindex",-1)):s.setAttribute("inert","");});}ot(){if((!this.pagination||this.pagination&&this.o.assignedNodes().length!==this.l+1)&&(this.a.forEach(t=>{t.removeEventListener("macro-carousel-pagination-indicator-clicked",this),this.removeChild(t);}),this.a.length=0),this.pagination){if(this.o.assignedNodes().length!==this.l+1){const t=document.createDocumentFragment();for(let i=0;i<=this.l;i++){const s=document.createElement("macro-carousel-pagination-indicator");s.textContent=i,s.setAttribute("slot","paginationSlot"),s.setAttribute("aria-label",`Go to item ${i+1}`),s.addEventListener("macro-carousel-pagination-indicator-clicked",this),t.appendChild(s),this.a.push(s);}this.appendChild(t);}this.a.forEach((t,i)=>{i===this.selected?t.classList.add("selected"):t.classList.remove("selected");});}}V(t){this.selected=parseInt(t.target.textContent,10);}pt(t){const i=document.createElement("macro-carousel-nav-button");return i.classList.add(t),i.setAttribute("slot","navigationSlot"),i.addEventListener("macro-carousel-nav-button-clicked",this),/next/.test(t)&&i.setAttribute("flipped",""),i}at(){(!this.navigation||this.navigation&&2!==this.n.assignedNodes().length)&&(this.n.assignedNodes().forEach(t=>{t.removeEventListener("macro-carousel-nav-button-clicked",this),this.removeChild(t);}),this.r=void 0,this.h=void 0),this.navigation&&(2!==this.n.assignedNodes().length&&(this.r=this.pt("macro-carousel-previous"),this.appendChild(this.r),this.h=this.pt("macro-carousel-next"),this.appendChild(this.h)),this.r.disabled=!this.loop&&0===this.selected,this.h.disabled=!this.loop&&this.selected===this.l,this.r.setAttribute("aria-label",`Go to ${this.loop&&0===this.selected?"last":"previous"} item`),this.h.setAttribute("aria-label",`Go to ${this.loop&&this.selected===this.l?"first":"next"} item`));}tt(){this.d=this.loop&&this.dt()>1;}bt(){return this.s.assignedNodes({flatten:!0}).forEach(t=>{t.nodeType===Node.TEXT_NODE&&t.parentNode&&t.parentNode.removeChild(t);}),this.s.assignedNodes({flatten:!0}).filter(t=>t.nodeType===Node.ELEMENT_NODE).map((t,i)=>({element:t,layoutIndex:i,position:this.mt(i)}))||[]}q(){this.c=this.bt(),this.c.forEach(t=>{t.element.hasAttribute("tabindex")||t.element.setAttribute("tabindex",-1),"list"===this.getAttribute("role")&&t.element.setAttribute("role","listitem");});const t=this.c.length>0&&-1===this.l;this.Q(),t&&(this.selected=this.selected);}X(){1!==this.e.assignedNodes().length&&(this.vt=document.createElement("div"),this.vt.setAttribute("slot","ariaSlot"),this.vt.setAttribute("aria-live","polite"),this.vt.setAttribute("aria-atomic","true"),this.appendChild(this.vt));const t=this.c[this.selected].layoutIndex;let i="";for(let s=0;s<this.slidesPerView;s++)i+=(t+s)%this.c.length+1,s<this.slidesPerView-2?i+=", ":s<this.slidesPerView-1&&(i+=" and ");this.vt.textContent=`Item${this.slidesPerView>1?"s":""} ${i} of ${this.c.length} visible`;}nt(){this.disableDrag?(this.t.removeEventListener("touchstart",this),this.t.removeEventListener("mousedown",this)):(this.t.addEventListener("touchstart",this,getEvtListenerOptions(!0)),this.t.addEventListener("mousedown",this,getEvtListenerOptions(!0)));}Y(t){this.k||(this.N=!1,this.k=!0,this._=t.id,this.S=this.M=this.W=t.x,this.z=this.C=this.P=t.y,this.L=this.c[this.selected].layoutIndex,this.G=[],this.wt(this.M),window.addEventListener("touchmove",this,getEvtListenerOptions(!1)),window.addEventListener("mousemove",this,getEvtListenerOptions(!1)),window.addEventListener("mouseup",this),window.addEventListener("touchend",this),window.addEventListener("touchcancel",this));}U(t){if(this.k&&t.id===this._){this.W=t.x,this.P=t.y;const i=Math.abs(this.W-this.S),s=Math.abs(this.P-this.z);i/s>o||0===s||s>i&&s-i<n?(t.event.preventDefault(),this.wt(this.M),this.B(),this.ft()):this.K();}}J(t){this.k&&t.id===this._&&this.K();}K(){this.k=!1,this._=void 0,this.wt(this.M),window.removeEventListener("touchmove",this),window.removeEventListener("mousemove",this),window.removeEventListener("touchend",this),window.removeEventListener("mouseup",this),window.removeEventListener("touchcancel",this),this.kt();}wt(t){const i=Date.now();for(;this.G.length>0&&!(i-this.G[0].time<=100);)this.G.shift();this.G.push({x:t,time:i});}ft(){this.F||requestAnimationFrame(this.xt.bind(this)),this.F=!0;}xt(){const t=this.v+this.W-this.M;let i,s;if(this.c.forEach((e,o)=>{e.position>=t&&(void 0===s||e.position<s)&&(s=e.position,i=o);}),this.d){let t;if(void 0===i){const s=this.c.slice(0).sort((t,i)=>t.layoutIndex>i.layoutIndex)[0];for(i=s.layoutIndex-1;i<0;)i+=this.c.length;i%=this.c.length,t=s.layoutIndex-2;}else t=this.c[i].layoutIndex-1;const s=[],e=t+this.slidesPerView+2;for(let i=t;i<e;i++)s.push(i);this.st(s);}else i=i||0;this.L=this.c[i].layoutIndex,this.gt(t),this.M=this.W,this.C=this.P,this.F=!1;}kt(){this.N=!0;const t=this.G[this.G.length-1],i=this.G[0],o=t.x-i.x||0;this.u=Math.floor(this.L/this.c.length);const a=this.ut(this.L);let n;if(0===o)this.T=0,n=this.c[a].position-this.v>this.b/2?this.ht(a):a;else{this.T=function(t,i,s){if(0===t)throw new RangeError("x must be different from `0`");return t/Math.abs(t)*clamp(Math.abs(t),i,s)}(o,this.$,this.I);let t=1;const i=this.g*s;for(;Math.abs(o)>i*t&&t<this.slidesPerView+e;)t+=1;o>0&&(t-=1);let r=a;for(let i=0;i<t;i++)r=o<0?this.ht(r):this.rt(r);n=r;}this.selected=clamp(n,0,this.l),requestAnimationFrame(this.yt.bind(this));}yt(){if(!this.N)return;const t=this.c[this.selected].position;this.T+=this.D*(t-this.v),this.T*=this.A;const i=this.v+this.T;(Math.abs(t-i)>=1||Math.abs(this.T)>=1)&&!this.reducedMotion?(this.gt(i),requestAnimationFrame(this.yt.bind(this))):(this.gt(t),this.N=!1,this.O(),requestAnimationFrame(()=>{this.H(),this.R(),this.X();}));}});class MacroCarouselButton extends HTMLElement{constructor(){super();const t=Object.getPrototypeOf(this).constructor.template;this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t.content.cloneNode(!0));}connectedCallback(){window.ShadyCSS&&window.ShadyCSS.styleElement(this),this._t=0,this.hasAttribute("role")||this.setAttribute("role","button"),this.hasAttribute("tabindex")?this._t=this.getAttribute("tabindex"):this.setAttribute("tabindex",this._t),this.j("disabled"),this.addEventListener("keydown",this),this.addEventListener("click",this);}j(t){if(this.hasOwnProperty(t)){const i=this[t];delete this[t],this[t]=i;}}static get observedAttributes(){return ["disabled"]}set disabled(t){booleanSetter(this,"disabled",t);}get disabled(){return booleanGetter(this,"disabled")}attributeChangedCallback(t,i,s){switch(t){case"disabled":if(i===s)return;this.disabled?(this._t=this.getAttribute("tabindex"),this.removeAttribute("tabindex"),this.setAttribute("aria-disabled","true")):(this.setAttribute("tabindex",this._t),this.setAttribute("aria-disabled","false"));}}handleEvent(t){this.disabled?t.preventDefault():"click"===t.type?this.St&&this.St():"keydown"!==t.type||32!==t.keyCode&&13!==t.keyCode||(t.preventDefault(),this.St&&this.St());}}const r=document.createElement("template");r.innerHTML='<style>:host{--macro-carousel-navigation-color:#000;--macro-carousel-navigation-color-focus:var(--macro-carousel-navigation-color);--macro-carousel-navigation-color-background:transparent;--macro-carousel-navigation-color-background-focus:#f0f0f0;--macro-carousel-navigation-button-size:48px;--macro-carousel-navigation-icon-size:24px;--macro-carousel-navigation-icon-mask:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath d=\'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\'/%3E%3C/svg%3E");position:relative;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;min-width:var(--macro-carousel-navigation-button-size);min-height:var(--macro-carousel-navigation-button-size);border-radius:50%;overflow:hidden;cursor:pointer;contain:paint}:host([disabled]){opacity:.2}.bg,.content{position:absolute;top:0;right:0;bottom:0;left:0}.content{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;background-color:var(--macro-carousel-navigation-color-background)}.bg{z-index:0;background-color:var(--macro-carousel-navigation-color-background-focus);opacity:0;will-change:opacity}.icon{position:relative;z-index:1;width:var(--macro-carousel-navigation-icon-size);height:var(--macro-carousel-navigation-icon-size);color:var(--macro-carousel-navigation-color);background:var(--macro-carousel-navigation-icon-mask)}@supports ((-webkit-mask-image:var(--macro-carousel-navigation-icon-mask)) or (mask-image:var(--macro-carousel-navigation-icon-mask))){.icon{background:var(--macro-carousel-navigation-color);-webkit-mask-image:var(--macro-carousel-navigation-icon-mask);mask-image:var(--macro-carousel-navigation-icon-mask)}}:host([flipped]) .icon{-webkit-transform:rotate(180deg);transform:rotate(180deg)}:host(.focus-visible) .bg,:host(:active:not([disabled])) .bg,:host(:focus:not([disabled])) .bg,:host(:hover:not([disabled])) .bg{opacity:1}:host-context(.js-focus-visible):host(:focus:not(:active):not(:hover):not(.focus-visible)) .bg{opacity:0}@supports ((-webkit-mask-image:var(--macro-carousel-navigation-icon-mask)) or (mask-image:var(--macro-carousel-navigation-icon-mask))){:host(.focus-visible) .icon,:host(:active:not([disabled])) .icon,:host(:focus:not([disabled])) .icon,:host(:hover:not([disabled])) .icon{background:var(--macro-carousel-navigation-color-focus)}:host-context(.js-focus-visible):host(:focus:not(:active):not(:hover):not(.focus-visible)) .icon{background:var(--macro-carousel-navigation-color)}}</style> <div class="content"> <div class="bg"></div> <div class="icon"></div> </div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(r,"macro-carousel-nav-button");window.customElements.define("macro-carousel-nav-button",class MacroCarouselNavButton extends MacroCarouselButton{static get template(){return r}St(){this.dispatchEvent(new CustomEvent("macro-carousel-nav-button-clicked"));}});const h=document.createElement("template");h.innerHTML='<style>:host{--macro-carousel-pagination-color:#999;--macro-carousel-pagination-color-selected:#000;--macro-carousel-pagination-size-clickable:24px;--macro-carousel-pagination-size-dot:8px;--macro-carousel-pagination-border:1px solid var(--macro-carousel-pagination-color);--macro-carousel-pagination-border-selected:1px solid var(--macro-carousel-pagination-color-selected);position:relative;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;width:var(--macro-carousel-pagination-size-clickable);height:var(--macro-carousel-pagination-size-clickable);overflow:hidden;cursor:pointer;contain:paint}.bg,.fg,:host{border-radius:50%}.bg,.fg{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);display:block;width:var(--macro-carousel-pagination-size-dot);height:var(--macro-carousel-pagination-size-dot);-webkit-box-sizing:border-box;box-sizing:border-box;background-color:var(--macro-carousel-pagination-color);content:""}.bg{-webkit-transform:translate(-50%,-50%) scale(2);transform:translate(-50%,-50%) scale(2);opacity:0;will-change:opacity}.fg{border:var(--macro-carousel-pagination-border)}:host(.focus-visible) .bg,:host(:hover) .bg{opacity:.2}:host(.selected) .fg{background-color:var(--macro-carousel-pagination-color-selected);border:var(--macro-carousel-pagination-border-selected)}</style> <div class="bg"></div> <div class="fg"></div> ',window.ShadyCSS&&window.ShadyCSS.prepareTemplate(h,"macro-carousel-pagination-indicator");window.customElements.define("macro-carousel-pagination-indicator",class MacroCarouselPaginationIndicator extends MacroCarouselButton{static get template(){return h}St(){this.dispatchEvent(new CustomEvent("macro-carousel-pagination-indicator-clicked"));}});}();

  class ModalDialog extends litElement.LitElement {
    static get properties() {
      return {
        open: {
          type: Boolean,
          attribute: 'open-modal',
          reflect: true
        },
        source: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.open = false;
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
      .modal {
        position: fixed;
        background: var(--palette-accent-transparent);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-index-interrupt);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-window {
        position: relative;
        padding: 0.5em;
        border-radius: var(--border-radius);
        background: var(--palette-light);
      }
      .modal-content {
        max-height: 90vh;
        max-width: 90vw;
      }
      .modal-close {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: var(--border-radius);
      }
      .control {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--icon-size-large);
        color: var(--palette-accent);
        text-align: center;
        cursor: pointer;
        padding: var(--border-radius);
        background-color: var(--palette-light);
        border: none;
        border-radius: 50%;
      }
      [data-closed] {
        display: none;
      }
    `];
    }

    render() {
      return litElement.html`
      <div class="modal b-close-modal" role="dialog" aria-hidden="true" ?data-closed="${!this.open}" @click="${this.handleClick}">
        <div class="modal-window">
            <button class="control modal-close b-close-modal"><i class="material-icons b-close-modal" title="Hide">close</i></button>
            ${(!this.source)?'':litElement.html`
              <img class="modal-content" src="${this.source}" />
            `}
        </div>
      </div>
    `;
    }

    toggleOpen() {
      this.open = !this.open;
    }

    handleClick(e) {
      if (e.target.classList.contains('b-close-modal')) {
        this.toggleOpen();
      }
    }
  }
  customElements.define('modal-dialog', ModalDialog);

  class SitePhotos extends litElement.LitElement {
    static get properties() {
      return {
        photos: Array,
        clickedImg: {
          type: String,
          attribute: false
        },
        printLayout: {
          type: Boolean,
          attribute: 'print-layout'
        }
      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return litElement.css`
      macro-carousel {
        padding: 0 3em;
        max-width: 75vw;
        margin: 0 auto;
      }
      .slide {
        min-height: 40vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide[data-compact] {
        max-height: 40vh;
      }
      .slide img {
        max-width: 100%;
      }
      .text {
        background-color: var(--palette-accent-transparent);
        color: var(--palette-white);
        position: absolute;
        left: 0;
        width: 100%;
      }
      .text p {
        margin: 0 1em;
      }
      .title {
        top: 0;
      }
      .caption {
        bottom: 0;
        max-height: calc(var(--line-height) * 3);
        overflow: hidden;
      }
    `;
    }

    render() {
      return litElement.html`
    ${(!this.photos)?'':litElement.html`
    <macro-carousel navigation pagination>
    <slot>
      ${this.photos.map((el) => (!el.FileURL)?'':litElement.html`
      <div class="slide" title="Double-click to expand" ?data-compact="${!this.printLayout}">
        <img 
          src="${el.FileURL}"
          alt="${el.Description}"
          @dblclick="${this.handleImageClick}"
        />

        ${(!el.Image_Number)?'':litElement.html`
        <div class="title text">
          <p>
            PP${el.Image_Number}
          </p>
        </div>
        `}

        ${(!el.Description)?'':litElement.html`
        <div class="caption text">
          <p>
            ${el.Description}
          </p>
        </div>
        `}
      </div>
      `)}
    </slot>
    </macro-carousel>
    <modal-dialog></modal-dialog>
    `}
    `;
    }

    firstUpdated() {
      this.$modal = this.renderRoot.querySelector('modal-dialog');
    }

    handleImageClick(e) {
      this.clickedImg = e.target.src;
      this.$modal.source = this.clickedImg;
      this.$modal.toggleOpen();
    }
  }
  customElements.define('site-photos', SitePhotos);

  class SiteDetails extends litElement.LitElement {
    static get properties() {
      return {
        siteinfo: {
          type: Object,
          attribute: false
        },
        photos: {
          type: Array,
          attribute: false
        },
        pdfpanel: {
          type: Object,
          attribute: false
        },
        pdfsrc: {
          type: String
        },
        printLayout: {
          type: Boolean,
          attribute: 'print-layout'
        },
        alldata: {
          type: Object,
          attribute: false
        }
      };
    }

    constructor() {
      super();
      this.genId = (function() {
        const memo = {};
        return function(index) {
          if (!memo[index]) {
            memo[index] = wgnhsCommon.genId();
          }
          return memo[index];
        }
      })();
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
      [data-element="table"] {
        display: grid;
        grid-template-columns: 30% 1fr;
        grid-gap: 0.5em;
        width: 100%;
      }

      td {
        padding: 0.5em;
      }

      .label {
        background-color: var(--palette-dark);
        font-weight: var(--font-weight-bold);
      }

      .detail {
        background-color: var(--palette-light);
      }

      .header {
        position: -webkit-sticky;
        position: sticky;
        top: 0px;
        background-color: var(--palette-white);
        padding: var(--font-size-extra-large) var(--border-radius);
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .header h1 {
        padding: 0;
        max-width: 70%;
        text-align: center;
      }
      .header i {
        font-size: var(--icon-size-large);
        color: var(--palette-accent);
        cursor: pointer;
      }
      
      [data-closed] {
        display: none;
      }

      app-collapsible i {
        font-size: var(--icon-size-large);
      }

      app-collapsible i[slot="header-after"]::after {
        content: "expand_more";
      }

      app-collapsible[open] i[slot="header-after"]::after {
        content: "expand_less";
      }
    `];
    }

    get renderTable() {
      let key = 0, value = 1;
      return Object.entries(this.siteinfo).filter((el, index) => {
        return !ignoredKeys.includes(el[key]);
      }).map((el, index) => litElement.html`
    <td class="label" title="${(keyLookup[el[key]])?keyLookup[el[key]].desc:el[key]}">
      <label for="${this.genId(index)}" >
        ${(keyLookup[el[key]])?keyLookup[el[key]].title:el[key]}
      </label>
    </td>
    <td class="detail" title="${(keyLookup[el[key]])?keyLookup[el[key]].desc:el[key]}">
      <span id="${this.genId(index)}">
        ${(keyLookup[el[key]]&&keyLookup[el[key]].transform)?keyLookup[el[key]].transform(el[value]):el[value]}
      </span>
    </td>
  `)
    }

    render() {
      return litElement.html`
      ${(!this.siteinfo)? '' : litElement.html`
        <div class="header">
          <span>
            <a href="${window.router.link('view', this.siteinfo)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Back to website" @click="${this.fireTogglePrint}" ?data-closed="${!this.printLayout}">arrow_back</i></a>
            <a href="${window.router.link('entry')}" onclick="event.preventDefault()"><i class="material-icons clear-selection" title="Clear selection" @click="${this.fireClearSelection}" ?data-closed="${this.printLayout}">arrow_back</i></a>
          </span>
          <h1>${this.siteinfo.County} County Spring #${this.siteinfo.SpringID}</h1>
          <span>
            <a href="${window.router.link('print', this.siteinfo)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Print layout" @click="${this.fireTogglePrint}" ?data-closed="${this.printLayout}">zoom_out_map</i></a>
            <i class="material-icons print-action" title="Print this page" @click="${this.handlePrint}" ?data-closed="${!this.printLayout}">print</i>
          </span>
        </div>
        <site-photos .photos="${this.photos}" ?print-layout="${this.printLayout}"></site-photos>
        <site-sketch-button
          .panel=${this.pdfpanel}
          src="${this.pdfsrc}"></site-sketch-button>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Water quality">bar_chart</i>
          <span slot="header">Water quality</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content">
            <site-water-quality .siteinfo="${this.siteinfo}" .alldata="${this.alldata}"></site-water-quality>
          </div>
        </app-collapsible>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Spring-bed materials">bar_chart</i>
          <span slot="header">Spring-bed materials</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content">
            <site-bed-materials .siteinfo="${this.siteinfo}"></site-bed-materials> 
          </div>
        </app-collapsible>
        <app-collapsible .open="${this.printLayout}">
          <i slot="header-before" class="material-icons" title="All data">view_list</i>
          <span slot="header">All data</span>
          <i slot="header-after" class="material-icons"></i>
          <div slot="content" data-element="table">
            ${this.renderTable}
          </div>
        </app-collapsible>
      `}
    `;
    }

    handlePrint() {
      window.print();
    }

    fireClearSelection() {
      let event = new CustomEvent('clear-selection', {
        bubbles: true,
        detail: {}
      });
      this.dispatchEvent(event);
    }
    fireTogglePrint() {
      let event = new CustomEvent('toggle-print', {
        bubbles: true,
        detail: {
          on: !this.printLayout,
          params: this.siteinfo
        }
      });
      this.dispatchEvent(event);
    }
  }
  customElements.define('site-details', SiteDetails);

  const CHANGE_EVENT = 'map-control';
  const STYLE_EVENT = 'stylepoints';
  const RESET_TYPE = 'normal';

  class MapControls extends litElement.LitElement {
    static get properties() {
      return {
        alldata: {
          type: Object,
          attribute: false
        }
      };
    }

    constructor() {
      super();
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
      .option-container {
        box-sizing: border-box;
        padding: var(--border-radius)
      }
      .plot-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .type-container {
        margin: var(--font-size);
      }
    `];
    }

    render() {
      return litElement.html`
      <div class="option-container">
        <map-control-item 
          name="Spring Type"
          type="type">
          <span>
          About 26 percent of the springs inventoried emerge as fracture or contact springs, and 74 
          percent have seepage-filtration morphologies. At a fracture spring, groundwater discharges 
          from joints or fractures in bedrock. Contact springs discharge water at a stratigraphic 
          contact, along which fractures often form. Groundwater discharges from many small openings 
          in permeable, unlithified material at a seepage-filtration spring.
          </span>
          <div class="type-container">
            <div><legend-dot></legend-dot><span>Fracture or contact spring</span></div>
            <div><legend-dot alt></legend-dot><span>Seepage-filtration morphology</span></div>
          </div>
        </map-control-item>
        <map-control-item 
          name="Discharge (cfs)"
          type="q">
          <span>
          The average flow rate of the springs for which flow could be measured was 0.96 ft&sup3;/s; 
          values ranged from 0.14 ft&sup3;/s to 18.3 ft&sup3;/s.
          </span>
          <div class="plot-container">
            <dot-plot
              .options="${dischargeDotPlotOptions}"
              .alldata="${this.alldata}"></dot-plot>
          </div>
        </map-control-item>
        <map-control-item 
          name="Conductivity (µS)"
          type="cond">
          <span>
          Conductivity approximates the concentration of total dissolved solids in spring water. 
          The lowest spring water conductivity values are in the north-central and northwestern 
          parts of the state and the highest values are in southern and south-eastern Wisconsin.
          </span>
          <div class="plot-container">
            <dot-plot
              .options="${conductivityDotPlotOptions}"
              .alldata="${this.alldata}"></dot-plot>
          </div>
        </map-control-item>
      </div>
    `;
    }
  }
  customElements.define('map-controls', MapControls);

  class MapControlItem extends litElement.LitElement {
    static get properties() {
      return {
        name: {
          type: String
        },
        type: {
          type: String
        },
        selected: {
          type: Boolean,
          attribute: false
        }
      };
    }

    constructor() {
      super();
      this.genId = wgnhsCommon.genId();
      this.selected = false;
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
    .icon {
      font-size: var(--icon-size-extra-large);
    }
    .icon[active] {
      color: var(--palette-active);
    }
    app-collapsible {
      --transition-duration: 0;
      --el-header-font-weight: var(--font-weight);
      --el-header-font-size: var(--font-size);
      --el-header-background: var(--palette-white);
      --el-border: 1px solid var(--palette-light);
    }
    [slot] {
      padding: var(--border-radius);
    }
    `];
    }

    render() {
      return litElement.html`
    <app-collapsible @open="${this.handleOpen}" .open=${this.selected}>
      <span slot="header-before">${this.name}</span>
      <i slot="header-after" 
        class="icon material-icons" 
        title="View on map"
        ?active=${this.selected}>map</i>
      <slot slot="content"></slot>
    </app-collapsible>
    `;
    }

    handleOpen(e) {
      if (this.selected !== e.detail.value) {
        wgnhsCommon.dispatch(this.parentElement, CHANGE_EVENT, {
          type: this.type, 
          value: e.detail.value
        });
      }
    }

    handleSelect(e) {
      if (e.detail.type === this.type) {
        this.selected = e.detail.value;
        wgnhsCommon.dispatch(document, STYLE_EVENT, {
          type: (this.selected)?this.type:RESET_TYPE
        });
      } else {
        this.selected = false;
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.__selectHandler = this.handleSelect.bind(this);
      this.parentElement.addEventListener(CHANGE_EVENT, this.__selectHandler);
    }

    disconnectedCallback() {
      this.parentElement.removeEventListener(CHANGE_EVENT, this.__selectHandler);
      super.disconnectedCallback();
    }
  }
  customElements.define('map-control-item', MapControlItem);

  class LegendDot extends litElement.LitElement {
    static get properties() {
      return {
        alt: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.alt = false;
    }

    static get styles() {
      return [
        ...wgnhsStyles.styles,
        litElement.css`
        .svg-icon {
          display: inline-flex;
          align-self: center;
        }
        .svg-icon svg {
          top: calc(var(--line-height) / 5);
          position: relative;
        }
        svg {
          width: var(--font-size);
          height: var(--line-height);
        }
      `
      ];
    }

    render() {
      return litElement.html`
    <span class="svg-icon">
    <svg viewBox="-4 -12 16 22">
      <g>
        <path
          stroke="${this.color}"
          stroke-opacity="1"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="${this.color}"
          fill-opacity="0.2"
          fill-rule="evenodd"
          d="M0,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0">
        </path>
      </g>
    </svg>
  </span>
    `;
    }

    get color() {
      return (!this.alt)?'var(--map-symbol)':'var(--map-symbol-alt)';
    }
  }
  customElements.define('legend-dot', LegendDot);

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
    };

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
    }
    window.router = new wgnhsRouter.SiteRouter();
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
          });
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
          });
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
    if (e.detail.closed) {
      window.pdfPanel.setAttribute('data-closed', true);
    } else {
      window.pdfPanel.removeAttribute('data-closed');
    }
  });

  document.addEventListener('stylepoints', function(e) {
    if (e.detail.type) {
      window.siteMap.updatePoints(e.detail.type + 'points');
    }
  });

  exports.MapControls = MapControls;
  exports.SiteDetails = SiteDetails;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
