
const colorRange = [
  'var(--map-bin-0)',
  'var(--map-bin-1)',
  'var(--map-bin-2)',
  'var(--map-bin-3)',
  'var(--map-bin-4)',
  'var(--map-bin-5)',
  'var(--map-bin-6)'
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
    var binRanges = [
      [],
      [],
      [0, 300],
      [300, 502],
      [502, 676],
      [676, 926],
      [926, 2000]
    ];
    var prop = 'Conductivity_uS';
    this._binPoint(binRanges, colorRange, prop);
  },
  _discharge: function() {
    var binRanges = [
      [0.1, 0.2],
      [0.2, 0.5],
      [0.5, 1.0],
      [1, 2],
      [2, 5],
      [5, 10],
      [10, 20]
    ];
    var prop = 'Discharge_cfs';
    this._binPoint(binRanges, colorRange, prop);
  },
  _binPoint: function(ranges, colors, prop) {
    let result = colors[0];
    const val = this.feature.properties[prop];
    for (let i = 0; i < ranges.length; i++) {
      if (ranges[i] && val > ranges[i][0] && val <= ranges[i][1]) {
        result = colors[i];
      }
    }
    if (!this._activeBackup) {
      this.setStyle({'color': result});
    } else {
      this._activeBackup = result;
    }
  },
  highlight: function() {
    this._activeBackup = this.options.color;
    this.setStyle({'color': 'var(--map-symbol-active'})
  },
  removeHighlight: function() {
    if (this._activeBackup) {
      this.setStyle({'color': this._activeBackup})
      this._activeBackup = null;
    }
  }
});

RestylingCircleMarker.calcRadius = (a) => Math.max(Math.floor(a/1.5),3);