
const colorRange = [
  '#e0ecf4',
  '#bfd3e6',
  '#9ebcda',
  '#8c96c6',
  '#8c6bb1',
  '#88419d',
  '#810f7c'
];
export const RestylingCircleMarker = L.CircleMarker.extend({
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
    this.setRadius(RestylingCircleMarker.calcRadius(e.target.getZoom()))
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
    this.setStyle({'color': 'orange'})
  },
  removeHighlight: function() {
    if (this._activeBackup) {
      this.setStyle({'color': this._activeBackup})
      this._activeBackup = null;
    }
  }
});

RestylingCircleMarker.calcRadius = (a) => Math.max(Math.floor(a/1.5),3);