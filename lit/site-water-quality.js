import { LitElement, html, css } from 'lit-element';
import { keyLookup, ignoredKeys } from '../app/site-data.js';
import { RestylingCircleMarker } from '../app/map/restyling-circle-marker.js';
import { dispatch } from 'wgnhs-common';

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

export class SiteWaterQuality extends LitElement {
  static get properties() {
    return {
        siteinfo: Object
    };
  }

  constructor() {
    super();
  }
    static get styles(){
        return css`
            .label{
               font-weight: bold;
            }
            .tick {
               font-size: 13px;

               /* why did I have to add this in?? */
               font-family: 'open_sansregular','Open Sans',sans_serif;

               color: #777;
            }
            .tick line {
               stroke: #777;
            }
            .annotation {
               font-size: 14px;
            }

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
        <!-- <h2>Water quality</h2> -->

       <!-- <span class="label">conductivity: </span><span>${this.siteinfo.Conductivity_uS}</span><br> -->
         <svg id="conductivity-chart"></svg><br>
       <!-- <span class="label">temperature: </span><span>${this.siteinfo.Water_Temp_C}</span><br> -->
         <svg id="temperature-chart"></svg><br>
       <!-- <span class="label">pH: </span><span>${this.siteinfo.pH}</span><br> -->
         <svg id="ph-chart"></svg>
        </div>
    `;
  } //end render

   firstUpdated() {
      this.phchart = d3.select(this.renderRoot.querySelector('#ph-chart'));
      this.temperaturechart = d3.select(this.renderRoot.querySelector('#temperature-chart'));
      this.conductivitychart = d3.select(this.renderRoot.querySelector('#conductivity-chart'));


      var siteph = [{pH:this.siteinfo.pH}];
      var siteWaterTemp = [{Water_Temp_C: this.siteinfo.Water_Temp_C}];
      var siteConductivity = [{Conductivity_uS: this.siteinfo.Conductivity_uS}];



      /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */


      var phDotPlotOptions = {
         svg: this.phchart,
         label: "pH",
         attributeKey: "pH",

         tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0],
         chartMin: 5.5,
         chartMax: 10,

        // svgWidth: svgWidth,
         siteInfo: this.siteinfo,
         allData:  aggrData.data

      };

      var tempDotPlotOptions = {
         svg: this.temperaturechart,
         attributeKey: "Water_Temp_C",

         tickValues:[5,7,9,11,13,15,17],
         chartMin: 5,
         chartMax: 17,

        // svgWidth: svgWidth,
         siteInfo: this.siteinfo,
         allData:  aggrData.data

      };

      var conductivityDotPlotOptions = {
         svg: this.conductivitychart,
         //label: "Conductivity (uS)",
         attributeKey: "Conductivity_uS",

         tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750],
         chartMin: 0,
         chartMax: 1750,

        // svgWidth: svgWidth,
         siteInfo: this.siteinfo,
         allData:  aggrData.data

      };



      /* -- draw the dot plots --*/

      this.tempPlot = new DotPlot(tempDotPlotOptions);
      this.phPlot = new DotPlot(phDotPlotOptions);
      this.condPlot = new DotPlot(conductivityDotPlotOptions);

      this.tempPlot.draw();
      this.phPlot.draw();
      this.condPlot.draw();

   }

   updated() {
      this.tempPlot.annotate(this.siteinfo['Site_Code']);
      this.phPlot.annotate(this.siteinfo['Site_Code']);
      this.condPlot.annotate(this.siteinfo['Site_Code']);
   }

}   //end export class

customElements.define('site-water-quality', SiteWaterQuality);



class DotPlot {
   constructor(dotPlotOptions) {
   this.options = dotPlotOptions;

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
      return d3.scaleLinear().domain([this.options.chartMin, this.options.chartMax]).range([0, this.chartWidth]);
   }

   get y_scale() {
      return d3.scaleBand().domain([""]).rangeRound([0, this.chartHeight]);
   }

   draw(){
      var options = this.options;

      // console.log("draw dot plot ranging from "+options.chartMin+" to "+options.chartMax+" with the value "+options.siteInfo[options.attributeKey]+" annotated. ");


      options.svg.attr('width', this.svgWidth).attr("height", this.svgHeight)
     // .style('background', "#cecece")
      ;


      //append a group.
      var chartgroup = options.svg.append("g").attr("class", "chartgroup").attr("transform", "translate("+this.margin.left+", "+this.margin.top+")");

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
     this.circles.selectAll("g")
         .data(options.allData, (d) => { return d.Site_Code; })
         .enter()
         .append("g")
         .append("circle")
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
//            this.annotate(d['Site_Code'])
         })
         .on('mouseenter', (d) => {this.highlight(d['Site_Code'])})
         .on('mouseleave', (d) => {this.unhighlight(d['Site_Code'])})
         ;

   } // END DRAW. draw is called once when on firstUpdated. 
   
   //annotate is called on update only. 
   annotate(siteCode) {
     
      var options = this.options;

      // var annotation = options.svg.append("g").attr("class", "annotation").attr("transform", "translate("+this.margin.left+", "+this.margin.top+")");
      var annotationData = options.allData;
      var annotationRadius = 6;
      var annotationLineLength = 30;
      var annotationLabelPadding = 5;


      //select all groups within the circles group, then filter down to the one that matches the site code. 
      var g = this.circles.selectAll("g")
         .filter((d) => d['Site_Code'] === siteCode)
         .moveToFront();
      
      var circle = g.select('circle')

         .attr('r', annotationRadius)                        // radius
         .attr("fill", "#000")                           // fill color
         .attr("stroke", "#333")
         .attr("stroke-width", 2)
         .attr("opacity", "0.85")                           // opacity


      var label = g.append("text")
         .attr('dy', '-0.75em') //vertical displacement 
         .html((d) => { 
            //console.log("keyLookup is: ", keyLookup[options.attributeKey]['title']);
            console.log("circle x:", circle.attr('cx'));
            return keyLookup[options.attributeKey]['title'] + ": "+d[options.attributeKey]
         })
         ;
      
      g.append("polyline")
         .attr('stroke', "#333333")      //set appearance
         .attr("stroke-width", 3)        //set appearance
         .style('fill', 'none')          //set appearance
         .attr('points', (d) => {
         
            // two points on each line:
             // A: center top of the circle 
             // B: point directly above the circle at a certain height 
             // each point is defined by an [x, y]
            var startpoint = [0,0]
                startpoint[0] = circle.attr('cx');
                startpoint[1] = circle.attr('cy')-circle.attr('r');

            var endpoint = [0,0];
                endpoint[0] = circle.attr('cx');
                endpoint[1] = -7;

             // console.log("start, end", startpoint, endpoint)
             return [startpoint, endpoint]        // return A, B
         
      })





      // annotation.selectAll("circle")
      //    .data(annotationData, (d) => { return d.Site_Code; })
      //    .enter()
      //    .append("circle")
      //    .attr("cx", (d) => {
      //          return this.x_scale(d[options.attributeKey])})              // x position
      //    .attr("cy", (d) => {
      //       console.log(this.chartHeight)
      //       return this.chartHeight/2})     // y position
      //    .attr('r', annotationRadius)                        // radius
      //    .attr("fill", "#406058")                           // fill color
      //    .attr("stroke", "#000")
      //    .attr("stroke-width", 2)
      //    .attr("opacity", "0.85");                           // opacity

      
      //   annotation.selectAll("polyline")
      //      .data(annotationData)
      //      .enter()
      //      .append("polyline")
      //      .attr('stroke', "#333333")      //set appearance
      //      .attr("stroke-width", 2)        //set appearance
      //      .style('fill', 'none')          //set appearance
      //      .attr('points', (d) => {

      //             // two points on each line:
      //             // A: centroid of the circle
      //             // B: 10 px above the circle
      //             // each point is defined by an [x, y]
      //            var startpoint = [0,0]
      //                startpoint[0] = this.x_scale(d[options.attributeKey]);
      //                startpoint[1] = (this.chartHeight/2)-annotationRadius;

      //            var endpoint = [0,0];
      //                endpoint[0] = this.x_scale(d[options.attributeKey]);
      //                endpoint[1] = (this.chartHeight/2)-annotationRadius-annotationLineLength;

      //             // console.log("start, end", startpoint, endpoint)
      //             return [startpoint, endpoint]        // return A, B
      //      })

     
   } //end ennotate 
   
   highlight(siteCode){
      
      var g = this.circles.selectAll("g")
         .filter((d) => d['Site_Code'] === siteCode)
         .moveToFront();

         g.select('circle')
         .attr("stroke-width", 3)
         .attr("opacity", "0.85")   
      
   } // end highlight
   
   unhighlight(siteCode){
      var g = this.circles.selectAll("g")
         .filter((d) => d['Site_Code'] === siteCode)
         .moveToFront();

         g.select('circle')
         .attr("stroke-width", 0)
         .attr("opacity", "0.7") 
      
   }  // end unhighlight 
   
}

