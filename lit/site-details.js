import { LitElement, html, css } from 'lit-element';
export { AppCollapsible } from './app-collapsible.js';
export { SitePhotos } from './site-photos.js';
export { SiteWaterQuality } from './site-water-quality.js'
export { SiteBedMaterials } from './site-bed-materials.js';
import { genId } from './gen-id.js';

export class SiteDetails extends LitElement {
  static get properties() {
    return {
      siteinfo: {
        type: Object
      },
      photos: {
        type: Array
      },
      printLayout: {
        type: Boolean,
        attribute: 'print-layout'
      }
    };
  }

  constructor() {
    super();
    this.genId = (function() {
      const memo = {};
      return function(index) {
        if (!memo[index]) {
          memo[index] = genId();
        }
        return memo[index];
      }
    })();
  }

  static get styles() {
    return css`
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
        padding: var(--font-size-extra-large);
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
      }
      .header h1 {
        padding: 0;
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
    `;
  }

  get renderTable() {
    let key = 0, value = 1;
    return Object.entries(this.siteinfo).filter((el, index) => {
      return !ignoredKeys.includes(el[key]);
    }).map((el, index) => html`
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
    return html`
      <style>
        @import url("./css/typography.css");
      </style>

      ${(!this.siteinfo)? '' : html`
        <div class="header">
          <span>
            <a href="${window.router.router.link('/view/' + this.siteinfo.Site_Code)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Back to website" @click="${this.fireTogglePrint}" ?data-closed="${!this.printLayout}">arrow_back</i></a>
            <a href="${window.router.router.link('/')}" onclick="event.preventDefault()"><i class="material-icons clear-selection" title="Clear selection" @click="${this.fireClearSelection}" ?data-closed="${this.printLayout}">arrow_back</i></a>
          </span>
          <h1>${this.siteinfo.County} County Spring #${this.siteinfo.SpringID}</h1>
          <span>
            <a href="${window.router.router.link('/print/' + this.siteinfo.Site_Code)}" onclick="event.preventDefault()"><i class="material-icons toggle-print" title="Print layout" @click="${this.fireTogglePrint}" ?data-closed="${this.printLayout}">print</i></a>
          </span>
        </div>
        <site-photos .photos="${this.photos}" ?print-layout="${this.printLayout}"></site-photos>
        <slot ?data-closed="${this.printLayout}" name="sketch"></slot>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Water quality">bar_chart</i>
          <span slot="header">Water quality</span>
          <i slot="header-after" class="material-icons">expand_more</i>
          <div slot="content">
            <site-water-quality .siteinfo="${this.siteinfo}"></site-water-quality>
          </div>
        </app-collapsible>
        <app-collapsible open>
          <i slot="header-before" class="material-icons" title="Spring-bed materials">bar_chart</i>
          <span slot="header">Spring-bed materials</span>
          <i slot="header-after" class="material-icons">expand_more</i>
          <div slot="content">
            <site-bed-materials .siteinfo="${this.siteinfo}"></site-bed-materials> 
          </div>
        </app-collapsible>
        <app-collapsible ?open="${this.printLayout}">
          <i slot="header-before" class="material-icons" title="All data">view_list</i>
          <span slot="header">All data</span>
          <i slot="header-after" class="material-icons">expand_more</i>
          <div slot="content" data-element="table">
            ${this.renderTable}
          </div>
        </app-collapsible>
      `}
    `;
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

let ignoredKeys = [
  'OBJECTID',
  'GlobalID',
  'File_Prefix',
  'Site_Code',
  'SpringID'
];
let keyLookup = {
  'pH': { 'title': 'pH', 'desc': 'Measured as close to spring source as possible.' },
  'Conductivity_uS': { 'title': 'Specific Conductance (µmho/cm)', 'desc': 'Measured as close to spring source as possible (µmho/cm).' },
  'Water_Temp_C': { 'title': 'Temperature (°C)', 'desc': 'Measured as close to spring source as possible (°C).' },
  'SpringID': { 'title': 'Spring ID', 'desc': 'Unique identifier within county.' },
  'County': { 'title': 'County', 'desc': 'County where spring is located.' },
  'Surveyor': { 'title': 'Surveyor(s)', 'desc': 'Who conducted the survey (initials).' },
  'Date': { 'title': 'Date', 'desc': 'Date of field survey.', 'transform': function(item) {return (!item)?null:new Date(item).toISOString().substring(0,10)} },
  'Time': { 'title': 'Time', 'desc': 'Start time.' },
  'Easting_WTM': { 'title': 'Easting (WTM)', 'desc': 'Easting (WTM). As close to the spring source as possible.' },
  'Northing_WTM': { 'title': 'Northing (WTM)', 'desc': 'Northing (WTM). As close to the spring source as possible.' },
  'Horz_Precision_m': { 'title': 'Horizontal Precision (meters)', 'desc': 'Horizontal accuracy of GPS position (meters).' },
  'Max_PDOP': { 'title': 'Maximum PDOP', 'desc': 'Maximum positional dilution of precision (PDOP) during measurement.' },
  'Elevation_m': { 'title': 'Elevation (meters)', 'desc': 'From digital elevation model (DEM) (meters).' },
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
