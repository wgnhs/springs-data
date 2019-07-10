
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