import { LitElement, html, css } from 'lit-element';
import { keyLookup } from '../site-data.js';
import { RestylingCircleMarker } from '../map/restyling-circle-marker.js';
import { dispatch } from 'wgnhs-common';
import { styles } from 'wgnhs-styles';

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

export const dischargeDotPlotOptions = {
  attributeKey: "Discharge_cfs",

  tickValues:[0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
  chartMin: 0,
  chartMax: 20,

  domain: [0, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0],
  labelFormat: ".1f", //show one number past the decimal point. 
};

export const conductivityDotPlotOptions = {
  attributeKey: "Conductivity_uS",

  tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750],
  chartMin: 0,
  chartMax: 1750,

  domain: [0, 1750],
  labelFormat: "d", //show as integer (decimal notation)
};

export const tempDotPlotOptions = {
  attributeKey: "Water_Temp_C",

  tickValues:[5,7,9,11,13,15,17],
  chartMin: 5,
  chartMax: 17,

  domain: [5, 17],
  labelFormat: "d", //show as integer (decimal notation)
};

export const phDotPlotOptions = {
  attributeKey: "pH",

  tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
  chartMin: 5.5,
  chartMax: 10,

  domain: [5.5, 10],
  labelFormat: ".1f", //show one number past the decimal point.
};


export class SiteWaterQuality extends LitElement {
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
    return css`
      .container {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
    `;
  }

  render() {
    return html`
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

export class DotPlotElement extends LitElement {
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
      ...styles,
      css`
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
    return html`
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

export class DotPlot {
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
        .call(g => g.select(".domain").remove())              // remove the horizontal line of the x axis. The horizontal line through the chart is a y axis tick.


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
         .attr("class", "datapoint")
      
      
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
               dispatch(document, 'interaction', {params: d});
         })
         .on('mouseenter', (d) => {this.highlight(d['Site_Code'])})
         .on('mouseleave', (d) => {this.unhighlight(d['Site_Code'])})
      
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
            var startpoint = [0,0]
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

