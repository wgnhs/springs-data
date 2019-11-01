
export class SiteData {
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
}

export const ignoredKeys = [
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
export const keyLookup = {
  'pH': { 'title': 'pH', 'desc': 'Measured as close to spring source as possible.' },
  'Conductivity_uS': { 'title': 'Specific conductance (µS/cm, 25°C)', 'desc': 'Specific Conductance: Measured as close to spring source as possible (µmho/cm).' },
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
  'Discharge_cfs': { 'title': 'Discharge (ft&sup3;/s)', 'desc': 'Spring flow (cfs).' },
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
