import { LitElement, html, css } from 'lit-element';

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
   }
   
   updated() {
            
      var siteph = [{pH:this.siteinfo.pH}];
      var siteWaterTemp = [{Water_Temp_C: this.siteinfo.Water_Temp_C}];
      var siteConductivity = [{Conductivity_uS: this.siteinfo.Conductivity_uS}];
      
      
      
      /* ~~~~~~~~~ SVG SETUP ~~~~~~~~~ */
      var svgWidth = 400;
      
      var phDotPlotOptions = {
         svg: this.phchart, 
         label: "pH",         
         attributeKey: "pH", 

         tickValues:[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0], 
         chartMin: 5.5, 
         chartMax: 10,
         
         svgWidth: svgWidth,
         siteInfo: this.siteinfo,
         allData:  aggrData.data 
         
      };
      
      var tempDotPlotOptions = {
         svg: this.temperaturechart, 
         label: "Temperature (C)",
         attributeKey: "Water_Temp_C", 
         
         tickValues:[5,7,9,11,13,15,17], 
         chartMin: 5, 
         chartMax: 17,
         
         svgWidth: svgWidth,
         siteInfo: this.siteinfo, 
         allData:  aggrData.data
         
      }; 
      
      var conductivityDotPlotOptions = {
         svg: this.conductivitychart,
         label: "Conductivity (uS)", 
         attributeKey: "Conductivity_uS", 
         
         tickValues:[0, 250, 500, 750, 1000, 1250, 1500, 1750], 
         chartMin: 0, 
         chartMax: 1750,
         
         svgWidth: svgWidth,
         siteInfo: this.siteinfo,
         allData:  aggrData.data
      
      };
      
      dotPlot.draw(tempDotPlotOptions);
      dotPlot.draw(phDotPlotOptions);
      dotPlot.draw(conductivityDotPlotOptions);
      
   }  //end updated() 
    
}   //end export class

customElements.define('site-water-quality', SiteWaterQuality);




// dotPlot is an immediately-invoked function expression. 

var dotPlot = (function (){
   
   // define functions that will be methods of dotPlot 
   
   var draw = function(options){ 
      
      // console.log("draw dot plot ranging from "+options.chartMin+" to "+options.chartMax+" with the value "+options.siteInfo[options.attributeKey]+" annotated. ");
      
      /* ---- SVG setup ---- */
      
      var svgHeight = 110;
      var svgWidth = options.svgWidth;
      var margin = {
                     top: 40,
                     right: 20,
                     bottom: 40,
                     left: 20  
                   }; 
      var chartWidth = svgWidth - margin.left - margin.right,
      chartHeight = svgHeight - margin.top - margin.bottom;
      
      options.svg.attr('width', svgWidth).attr("height", svgHeight)
        // .style('background', "#cecece")
      ;
      
      //append a group.
      var chartgroup = options.svg.append("g").attr("class", "chartgroup").attr("transform", "translate("+margin.left+", "+margin.top+")");  
      
      /* ~~~~~~~~~ Draw the chart ~~~~~~~~~ */
      
      var x_scale = d3.scaleLinear().domain([options.chartMin, options.chartMax]).range([0, chartWidth]); 
            
      var y_scale = d3.scaleBand().domain([""]).rangeRound([0, chartHeight]); 
      
      
      var xAxis = chartgroup.append("g").attr("class", "x-axis");
      xAxis
         .attr("transform", "translate(0," + chartHeight + ")")
         .call(
           d3
             .axisBottom(x_scale)
             .tickSizeInner(-chartHeight)
             .tickSizeOuter(0)
             .tickPadding(5)
             .tickValues(options.tickValues)
         )
         .call(g => g.select(".domain").remove())              // remove the horizontal line of the x axis. The horizontal line through the chart is a y axis tick. 
      
      
      var yAxis = chartgroup.append("g").attr("class", "y-axis");    // the y axis will have one tick, which forms the horizontal line through the center of the chart. 
      yAxis
         .call(
           d3
             .axisLeft(y_scale)
             .tickSizeInner(-chartWidth)
             .tickSizeOuter(0)
             .tickPadding(0)
         )
         .call(g => g.select(".domain").remove())           // no vertical line for the y axis (all vertical lines are x axis ticks)
         .call(g => g.selectAll("text").remove());          // no labels on y axis

     
     /* ~~~~~~~~~ circles ~~~~~~~~~ */ 
      
     var circles = chartgroup.append("g").attr("class", "circles");
      
     var jitterWidth = chartHeight; 
      
     circles.selectAll("circle")
         .data(options.allData)
         .enter()
         .append("circle")
         .attr("cx", function(d){return x_scale(d[options.attributeKey])})     // x position
         // Math.random() returns values from 0 to less than 1, in approximately uniform distribution. 
         .attr("cy", function(d){return chartHeight/2 - jitterWidth/2 + Math.random()*jitterWidth})     // y position
         .attr('r', 3)                                      // radius 
         .attr("fill", "#406058")                           // fill color
         .attr("opacity", "0.7");                           // opacity
      
      
      var annotation = chartgroup.append("g").attr("class", "annotation"); 
      var annotationRadius = 5;
      var annotationLineLength = 20; 
      var annotationLabelPadding = 5;
       
      
      var annotationData = [{rrr: options.siteInfo[options.attributeKey]}];
      
      annotation.selectAll("circle")
         .data(annotationData)
         .enter()
         .append("circle")
         .attr("cx", function(d){                       
                        return x_scale(d.rrr)})              // x position
         .attr("cy", function(d){return chartHeight/2})     // y position
         .attr('r', annotationRadius)                        // radius 
         .attr("fill", "#406058")                           // fill color
         .attr("stroke", "#000")
         .attr("stroke-width", 2)
         .attr("opacity", "0.85");                           // opacity
      
      annotation.selectAll("polyline")
         .data(annotationData)
         .enter()
         .append("polyline")
         .attr('stroke', "#333333")      //set appearance
         .attr("stroke-width", 2)        //set appearance
         .style('fill', 'none')          //set appearance
         .attr('points', function(d){
               
                // two points on each line: 
                // A: centroid of the circle
                // B: 10 px above the circle
                // each point is defined by an [x, y] 
               var startpoint = [0,0]
                   startpoint[0] = x_scale(d.rrr);
                   startpoint[1] = (chartHeight/2)-annotationRadius; 
         
               var endpoint = [0,0];
                   endpoint[0] = x_scale(d.rrr);
                   endpoint[1] = (chartHeight/2)-annotationRadius-annotationLineLength; 
         
               //  console.log("start, end", startpoint, endpoint)
                return [startpoint, endpoint]        // return A, B
         })
         
      annotation.selectAll("text")
         .data(annotationData)
         .enter()
         .append("text")
         .attr("font-weight", "bold")
         .html(function(d){ return options.label+": "+d.rrr})
         .attr("transform", function(d){
            var textpoint = [0, 0]
                textpoint[0] = x_scale(d.rrr);
                textpoint[1] = (chartHeight/2)-annotationRadius-annotationLineLength-annotationLabelPadding; 
         return 'translate('+textpoint+')'

         })
         .style('text-anchor', "middle")
     
      
      
      
   }
   
   // return an object with all methods of dotPlot named
   return {
      
      draw: draw
   }
   
})();